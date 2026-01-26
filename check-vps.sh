#!/bin/bash

# Script de diagnostic VPS pour AQTBOOST
# Usage: ssh aqtboost@51.75.251.155 'bash -s' < check-vps.sh

echo "🔍 Diagnostic VPS AQTBOOST"
echo "=========================="
echo ""

echo "📊 Ports en écoute:"
sudo lsof -i -P -n | grep LISTEN | grep -E ":(80|443|3000|3001|3002)" || echo "Aucun port web trouvé"
echo ""

echo "📁 Sites Nginx actifs:"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "Pas de sites Nginx configurés"
echo ""

echo "🔧 Configuration Nginx port 80:"
grep -r "listen 80" /etc/nginx/sites-enabled/ 2>/dev/null || echo "Aucune config sur le port 80"
echo ""

echo "🚀 Applications PM2:"
pm2 list || echo "PM2 non installé ou aucune app"
echo ""

echo "📝 Status de l'app AQTBOOST:"
pm2 show aqtboost 2>/dev/null || echo "App aqtboost non trouvée dans PM2"
echo ""

echo "🌐 Test de l'application locale:"
curl -s http://localhost:3002 | head -5 || echo "App non accessible sur le port 3002"
echo ""

echo "📂 Dossier aqtboost:"
ls -la ~/aqtboost/ | head -10 || echo "Dossier aqtboost non trouvé"
echo ""

echo "⚙️  Variables d'environnement (.env):"
if [ -f ~/aqtboost/.env ]; then
    echo "Fichier .env existe"
    grep -E "^(PORT|NEXTAUTH_URL|DATABASE_URL)" ~/aqtboost/.env || echo "Variables importantes manquantes"
else
    echo "❌ Fichier .env non trouvé"
fi
echo ""

echo "✅ Diagnostic terminé"
