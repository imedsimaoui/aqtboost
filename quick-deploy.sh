#!/bin/bash

# Script de déploiement rapide pour AQTBOOST sur VPS OVH
# Usage: ./quick-deploy.sh

VPS_IP="51.75.251.155"
VPS_USER="aqtboost"
APP_DIR="/home/aqtboost/aqtboost"

echo "🚀 Déploiement AQTBOOST sur VPS OVH"
echo "IP: $VPS_IP"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier si on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: package.json introuvable${NC}"
    echo "Veuillez exécuter ce script depuis le dossier racine du projet"
    exit 1
fi

echo -e "${YELLOW}📦 Création de l'archive...${NC}"
# Créer une archive sans node_modules et .next
tar -czf aqtboost-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='prisma/dev.db' \
  --exclude='prisma/dev.db-journal' \
  --exclude='.git' \
  --exclude='.env.local' \
  .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Échec de la création de l'archive${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archive créée${NC}"

echo -e "${YELLOW}📤 Upload vers le VPS...${NC}"
scp aqtboost-deploy.tar.gz $VPS_USER@$VPS_IP:~/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Échec de l'upload${NC}"
    echo "Vérifiez que vous pouvez vous connecter: ssh $VPS_USER@$VPS_IP"
    exit 1
fi

echo -e "${GREEN}✅ Upload terminé${NC}"

echo -e "${YELLOW}🔧 Déploiement sur le VPS...${NC}"
ssh $VPS_USER@$VPS_IP << 'ENDSSH'
cd ~

# Backup de l'ancien dossier si existe
if [ -d "aqtboost" ]; then
    echo "📦 Backup de l'ancienne version..."
    mv aqtboost aqtboost-backup-$(date +%Y%m%d_%H%M%S)
fi

# Créer le nouveau dossier
mkdir -p aqtboost
cd aqtboost

# Extraire l'archive
echo "📂 Extraction de l'archive..."
tar -xzf ~/aqtboost-deploy.tar.gz

# Nettoyer l'archive
rm ~/aqtboost-deploy.tar.gz

echo "✅ Déploiement terminé"
echo ""
echo "⚠️  Actions requises:"
echo "1. Configurez le fichier .env"
echo "2. Exécutez: npm install"
echo "3. Exécutez: npx prisma migrate deploy"
echo "4. Exécutez: npm run build"
echo "5. Démarrez avec: pm2 start ecosystem.config.js"
ENDSSH

# Nettoyer l'archive locale
rm aqtboost-deploy.tar.gz

echo ""
echo -e "${GREEN}✅ Déploiement initial terminé!${NC}"
echo ""
echo "📋 Prochaines étapes sur le VPS:"
echo "   ssh $VPS_USER@$VPS_IP"
echo "   cd ~/aqtboost"
echo "   nano .env  (configurer les variables)"
echo "   npm install"
echo "   npx prisma migrate deploy"
echo "   npm run build"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "📖 Voir le guide complet: DEPLOY-OVH.md"
