#!/bin/bash

# Script de configuration rapide pour le port 3002
# À exécuter sur le VPS après le déploiement

echo "🔧 Configuration AQTBOOST sur le port 3002"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Exécutez ce script depuis le dossier ~/aqtboost${NC}"
    exit 1
fi

echo -e "${YELLOW}1️⃣ Vérification du fichier .env...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Fichier .env introuvable${NC}"
    echo "Créez un fichier .env avec ces variables:"
    echo ""
    echo "DATABASE_URL=\"postgresql://aqtboost_user:VOTRE_MOT_DE_PASSE@localhost:5432/aqtboost\""
    echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\""
    echo "NEXTAUTH_URL=\"http://51.75.251.155:3002\""
    echo "NODE_ENV=\"production\""
    echo "PORT=3002"
    echo ""
    exit 1
fi

# Vérifier si PORT et NEXTAUTH_URL sont configurés
if ! grep -q "PORT=3002" .env; then
    echo -e "${YELLOW}Ajout de PORT=3002 au fichier .env...${NC}"
    echo "PORT=3002" >> .env
fi

if ! grep -q "NEXTAUTH_URL.*3002" .env; then
    echo -e "${YELLOW}Mise à jour de NEXTAUTH_URL dans .env...${NC}"
    sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="http://51.75.251.155:3002"|g' .env
fi

echo -e "${GREEN}✅ Fichier .env configuré${NC}"
echo ""

echo -e "${YELLOW}2️⃣ Ouverture du port 3002 dans le firewall...${NC}"
sudo ufw allow 3002/tcp
echo -e "${GREEN}✅ Port 3002 ouvert${NC}"
echo ""

echo -e "${YELLOW}3️⃣ Installation des dépendances...${NC}"
npm install
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

echo -e "${YELLOW}4️⃣ Génération du Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✅ Prisma Client généré${NC}"
echo ""

echo -e "${YELLOW}5️⃣ Exécution des migrations...${NC}"
npx prisma migrate deploy
echo -e "${GREEN}✅ Migrations appliquées${NC}"
echo ""

echo -e "${YELLOW}6️⃣ Build de l'application...${NC}"
npm run build
echo -e "${GREEN}✅ Build terminé${NC}"
echo ""

echo -e "${YELLOW}7️⃣ Configuration PM2...${NC}"
# Arrêter l'ancienne instance si elle existe
pm2 delete aqtboost 2>/dev/null || true

# Démarrer avec la nouvelle configuration
pm2 start ecosystem.config.js
pm2 save
echo -e "${GREEN}✅ PM2 configuré et application démarrée${NC}"
echo ""

echo -e "${YELLOW}8️⃣ Test de l'application...${NC}"
sleep 3
if curl -s http://localhost:3002 > /dev/null; then
    echo -e "${GREEN}✅ Application accessible sur http://localhost:3002${NC}"
else
    echo -e "${RED}❌ L'application ne répond pas${NC}"
    echo "Vérifiez les logs: pm2 logs aqtboost"
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Configuration terminée avec succès!"
echo "==========================================${NC}"
echo ""
echo "📍 Votre site est accessible à:"
echo "   http://51.75.251.155:3002"
echo ""
echo "📋 Commandes utiles:"
echo "   pm2 logs aqtboost       # Voir les logs"
echo "   pm2 restart aqtboost    # Redémarrer l'app"
echo "   pm2 monit               # Monitoring"
echo ""
