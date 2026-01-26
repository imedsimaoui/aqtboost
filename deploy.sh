#!/bin/bash

# Script de déploiement AQTBOOST
# Usage: ./deploy.sh

echo "🚀 Démarrage du déploiement AQTBOOST..."

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier si on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: package.json introuvable${NC}"
    echo "Veuillez exécuter ce script depuis le dossier racine du projet"
    exit 1
fi

# Pull les derniers changements
echo -e "${YELLOW}📥 Récupération des derniers changements...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Échec du git pull${NC}"
    exit 1
fi

# Installer les dépendances
echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Échec de l'installation des dépendances${NC}"
    exit 1
fi

# Générer Prisma Client
echo -e "${YELLOW}🔧 Génération du Prisma Client...${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Échec de la génération Prisma${NC}"
    exit 1
fi

# Exécuter les migrations
echo -e "${YELLOW}🗄️  Exécution des migrations...${NC}"
npx prisma migrate deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Échec des migrations${NC}"
    exit 1
fi

# Build le projet
echo -e "${YELLOW}🏗️  Build du projet...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Échec du build${NC}"
    exit 1
fi

# Redémarrer avec PM2
echo -e "${YELLOW}🔄 Redémarrage de l'application...${NC}"
pm2 restart aqtboost
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  PM2 restart échoué, tentative de start...${NC}"
    pm2 start ecosystem.config.js
fi

# Sauvegarder la config PM2
pm2 save

echo -e "${GREEN}✅ Déploiement terminé avec succès!${NC}"
echo -e "${GREEN}🎉 AQTBOOST est maintenant en ligne!${NC}"

# Afficher le statut
echo -e "\n${YELLOW}📊 Statut de l'application:${NC}"
pm2 status

echo -e "\n${YELLOW}💡 Commandes utiles:${NC}"
echo "  - Voir les logs: pm2 logs aqtboost"
echo "  - Voir le monitoring: pm2 monit"
echo "  - Arrêter l'app: pm2 stop aqtboost"
echo "  - Redémarrer l'app: pm2 restart aqtboost"
