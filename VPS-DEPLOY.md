# 🚀 Guide de Déploiement VPS - AQTBOOST

Guide complet pour déployer votre site AQTBOOST sur un VPS (Ubuntu/Debian).

## Prérequis

- VPS avec Ubuntu 20.04+ ou Debian 11+
- Accès root ou sudo
- Nom de domaine (ex: aqtboost.com)
- DNS configuré vers votre VPS

---

## 1. Connexion et Mise à Jour du VPS

```bash
# Se connecter au VPS
ssh root@VOTRE_IP

# Mettre à jour le système
apt update && apt upgrade -y

# Créer un utilisateur (recommandé au lieu de root)
adduser aqtboost
usermod -aG sudo aqtboost

# Se connecter avec le nouvel utilisateur
su - aqtboost
```

---

## 2. Installation de Node.js

```bash
# Installer Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node --version  # Devrait afficher v20.x.x
npm --version   # Devrait afficher 10.x.x

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

---

## 3. Installation et Configuration de PostgreSQL

```bash
# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer base de données et utilisateur
sudo -u postgres psql

# Dans le shell PostgreSQL:
CREATE DATABASE aqtboost;
CREATE USER aqtboost_user WITH ENCRYPTED PASSWORD 'VOTRE_MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON DATABASE aqtboost TO aqtboost_user;
\q

# Vérifier la connexion
psql -U aqtboost_user -d aqtboost -h localhost
```

---

## 4. Installation de Nginx

```bash
# Installer Nginx
sudo apt install -y nginx

# Démarrer Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier que Nginx fonctionne
curl http://localhost
# Vous devriez voir la page par défaut de Nginx
```

---

## 5. Cloner et Configurer votre Projet

```bash
# Installer Git si nécessaire
sudo apt install -y git

# Se placer dans le home
cd ~

# Cloner votre projet (ou uploader via FTP/SCP)
git clone https://github.com/VOTRE_USERNAME/boosting.git aqtboost
# OU uploader via SCP depuis votre machine locale:
# scp -r /Users/simaouiimed/boosting root@VOTRE_IP:/home/aqtboost/

cd aqtboost

# Installer les dépendances
npm install

# Créer le fichier .env
nano .env
```

### Contenu du fichier `.env`:

```env
# Database
DATABASE_URL="postgresql://aqtboost_user:VOTRE_MOT_DE_PASSE_FORT@localhost:5432/aqtboost"

# App
NEXT_PUBLIC_APP_URL=https://aqtboost.com
NODE_ENV=production

# Stripe (si configuré)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (si configuré)
RESEND_API_KEY=re_...
```

Sauvegarder avec `Ctrl + X`, puis `Y`, puis `Enter`.

---

## 6. Configurer Prisma et Build

```bash
# Mettre à jour schema.prisma pour PostgreSQL
nano prisma/schema.prisma

# Vérifier que la datasource est bien:
# datasource db {
#   provider = "postgresql"
# }

# Générer Prisma Client
npx prisma generate

# Exécuter les migrations
npx prisma migrate deploy

# Build le projet Next.js
npm run build

# Test local
npm start
# Ctrl+C pour arrêter
```

---

## 7. Configuration PM2

```bash
# Créer fichier de configuration PM2
nano ecosystem.config.js
```

Contenu du fichier:

```javascript
module.exports = {
  apps: [{
    name: 'aqtboost',
    script: 'npm',
    args: 'start',
    cwd: '/home/aqtboost/aqtboost',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/aqtboost/logs/err.log',
    out_file: '/home/aqtboost/logs/out.log',
    log_file: '/home/aqtboost/logs/combined.log',
    time: true
  }]
}
```

```bash
# Créer dossier logs
mkdir ~/logs

# Démarrer l'application avec PM2
pm2 start ecosystem.config.js

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs

# Sauvegarder la config PM2 pour redémarrage auto
pm2 save
pm2 startup
# Copier et exécuter la commande affichée
```

---

## 8. Configuration Nginx comme Reverse Proxy

```bash
# Créer configuration Nginx
sudo nano /etc/nginx/sites-available/aqtboost
```

Contenu du fichier:

```nginx
server {
    listen 80;
    server_name aqtboost.com www.aqtboost.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Optimisation pour Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3000/_next/static/;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    location /images/ {
        proxy_pass http://localhost:3000/images/;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/aqtboost /etc/nginx/sites-enabled/

# Supprimer la config par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

---

## 9. Installation SSL avec Let's Encrypt (HTTPS)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir certificat SSL (remplacer par votre email et domaine)
sudo certbot --nginx -d aqtboost.com -d www.aqtboost.com --email votre@email.com --agree-tos --no-eff-email

# Renouvellement auto SSL (test)
sudo certbot renew --dry-run

# Le certificat se renouvellera automatiquement tous les 90 jours
```

---

## 10. Configuration du Firewall

```bash
# Installer UFW si pas installé
sudo apt install -y ufw

# Autoriser SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le firewall
sudo ufw enable

# Vérifier le statut
sudo ufw status
```

---

## 11. Optimisations et Sécurité

### A. Sécuriser PostgreSQL

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Changer cette ligne:
# host    all             all             127.0.0.1/32            md5
# Par:
# host    all             all             127.0.0.1/32            scram-sha-256

sudo systemctl restart postgresql
```

### B. Configurer Swap (si VPS avec peu de RAM)

```bash
# Créer fichier swap de 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Rendre permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### C. Monitoring

```bash
# Installer htop pour monitoring
sudo apt install -y htop

# Voir les processus
htop

# Voir les logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Voir les logs PM2
pm2 logs aqtboost
```

---

## 12. Commandes Utiles pour la Maintenance

### Mise à jour du code

```bash
cd ~/aqtboost

# Pull les nouveaux changements
git pull origin main

# Installer nouvelles dépendances si nécessaire
npm install

# Rebuild
npm run build

# Redémarrer avec PM2
pm2 restart aqtboost

# Vérifier que tout fonctionne
pm2 status
pm2 logs
```

### Gestion PM2

```bash
# Voir les apps en cours
pm2 list

# Redémarrer
pm2 restart aqtboost

# Arrêter
pm2 stop aqtboost

# Supprimer
pm2 delete aqtboost

# Voir logs en direct
pm2 logs aqtboost

# Voir monitoring
pm2 monit
```

### Gestion Base de Données

```bash
# Se connecter à la BDD
psql -U aqtboost_user -d aqtboost -h localhost

# Backup de la BDD
pg_dump -U aqtboost_user -d aqtboost > backup_$(date +%Y%m%d).sql

# Restaurer backup
psql -U aqtboost_user -d aqtboost < backup_20260126.sql

# Voir les tables
psql -U aqtboost_user -d aqtboost -c "\dt"

# Voir les commandes
psql -U aqtboost_user -d aqtboost -c "SELECT * FROM \"Order\" LIMIT 10;"
```

---

## 13. Upload de Fichiers depuis votre Mac

### Option 1: SCP (Simple)

```bash
# Depuis votre Mac, dans le dossier boosting
scp -r * aqtboost@VOTRE_IP:/home/aqtboost/aqtboost/
```

### Option 2: Rsync (Recommandé - plus rapide)

```bash
# Depuis votre Mac
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  /Users/simaouiimed/boosting/ aqtboost@VOTRE_IP:/home/aqtboost/aqtboost/
```

### Option 3: Git (Meilleur pour production)

```bash
# Sur votre Mac - créer repo GitHub
cd /Users/simaouiimed/boosting
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/boosting.git
git push -u origin main

# Sur le VPS - cloner
git clone https://github.com/VOTRE_USERNAME/boosting.git aqtboost
```

---

## 14. Checklist Avant de Lancer

- [ ] DNS pointé vers votre VPS
- [ ] PostgreSQL installé et configuré
- [ ] .env créé avec les bonnes valeurs
- [ ] Migrations Prisma exécutées
- [ ] Build Next.js réussi
- [ ] PM2 lance l'app sans erreur
- [ ] Nginx configuré
- [ ] SSL installé (HTTPS)
- [ ] Firewall configuré
- [ ] Test de création de commande fonctionne
- [ ] Toutes les langues s'affichent correctement

---

## 15. Tester le Site

```bash
# Test local (depuis le VPS)
curl http://localhost:3000

# Test HTTP
curl http://aqtboost.com

# Test HTTPS
curl https://aqtboost.com

# Test création commande (remplacer par votre domaine)
curl -X POST https://aqtboost.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "game": "league-of-legends",
    "service": "rank-boost",
    "currentRank": "Gold",
    "desiredRank": "Platinum",
    "options": {},
    "customerEmail": "test@test.com"
  }'
```

---

## Problèmes Courants

### Site ne charge pas

```bash
# Vérifier PM2
pm2 status
pm2 logs

# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Vérifier les ports
sudo netstat -tlnp | grep 3000
sudo netstat -tlnp | grep 80
```

### Erreur base de données

```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Tester connexion
psql -U aqtboost_user -d aqtboost -h localhost

# Refaire migrations
cd ~/aqtboost
npx prisma migrate deploy
```

### Certificat SSL expiré

```bash
# Renouveler manuellement
sudo certbot renew

# Recharger Nginx
sudo systemctl reload nginx
```

---

## Support

Si vous rencontrez des problèmes:

1. Vérifier les logs: `pm2 logs`
2. Vérifier Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Vérifier PostgreSQL: `sudo tail -f /var/log/postgresql/postgresql-*-main.log`

---

## 🎉 Félicitations !

Votre site AQTBOOST est maintenant en ligne avec:
- ✅ HTTPS sécurisé
- ✅ Backend fonctionnel
- ✅ Base de données PostgreSQL
- ✅ 7 langues disponibles
- ✅ Logo custom
- ✅ Auto-redémarrage en cas de crash

Votre site est accessible sur **https://aqtboost.com** !
