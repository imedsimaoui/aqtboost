# Déploiement sur VPS OVH - AQTBOOST

## Informations
- **IP**: 51.75.251.155
- **Domaine**: À configurer (optionnel mais recommandé)

## Prérequis
- Accès SSH au VPS
- Ubuntu/Debian installé
- Accès root ou sudo

---

## Étape 1: Connexion au VPS

```bash
# Connectez-vous à votre VPS
ssh root@51.75.251.155

# Si vous avez un utilisateur non-root
ssh votre-utilisateur@51.75.251.155
```

---

## Étape 2: Mise à jour du système

```bash
# Mettre à jour les paquets
sudo apt update && sudo apt upgrade -y

# Installer les outils essentiels
sudo apt install -y curl git build-essential
```

---

## Étape 3: Installation de Node.js 20

```bash
# Installer Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node --version  # Devrait afficher v20.x.x
npm --version   # Devrait afficher 10.x.x
```

---

## Étape 4: Installation de PostgreSQL

```bash
# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier le statut
sudo systemctl status postgresql
```

### Configuration de PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le shell PostgreSQL, créer la base de données et l'utilisateur:
CREATE DATABASE aqtboost;
CREATE USER aqtboost_user WITH ENCRYPTED PASSWORD 'VOTRE_MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON DATABASE aqtboost TO aqtboost_user;
\q

# Note: Remplacez 'VOTRE_MOT_DE_PASSE_SECURISE' par un mot de passe fort
```

---

## Étape 5: Créer un utilisateur pour l'application

```bash
# Créer un utilisateur dédié
sudo adduser aqtboost
# Définir un mot de passe sécurisé

# Ajouter aux groupes sudo (optionnel)
sudo usermod -aG sudo aqtboost

# Se connecter en tant que cet utilisateur
sudo su - aqtboost
```

---

## Étape 6: Upload des fichiers

### Option A: Via Git (Recommandé)

```bash
# Sur votre VPS (en tant qu'utilisateur aqtboost)
cd ~
git clone https://github.com/votre-username/aqtboost.git
cd aqtboost
```

**IMPORTANT**: Avant de faire cette option, vous devez:
1. Créer un repo GitHub
2. Pusher votre code:
```bash
# Sur votre Mac
cd /Users/simaouiimed/boosting
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/aqtboost.git
git push -u origin main
```

### Option B: Via SCP (Upload direct)

```bash
# Sur votre Mac, depuis le dossier du projet
cd /Users/simaouiimed/boosting

# Compresser le projet (exclure node_modules et .next)
tar -czf aqtboost.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='prisma/dev.db' \
  --exclude='.git' \
  .

# Upload vers le VPS
scp aqtboost.tar.gz aqtboost@51.75.251.155:~/

# Sur le VPS
cd ~
tar -xzf aqtboost.tar.gz
mv boosting aqtboost  # Si nécessaire
cd aqtboost
```

---

## Étape 7: Configuration de l'environnement

```bash
# Sur le VPS, dans le dossier aqtboost
nano .env
```

Ajoutez:
```env
# Database
DATABASE_URL="postgresql://aqtboost_user:VOTRE_MOT_DE_PASSE_SECURISE@localhost:5432/aqtboost"

# NextAuth
NEXTAUTH_SECRET="GENERER_UNE_CLE_SECRETE_LONGUE_ET_ALEATOIRE"
NEXTAUTH_URL="http://51.75.251.155"

# App
NODE_ENV="production"
PORT=3000
```

**Pour générer NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Étape 8: Installation et Build

```bash
# Installer les dépendances
npm install

# Générer Prisma Client
npx prisma generate

# Exécuter les migrations
npx prisma migrate deploy

# Build l'application
npm run build
```

---

## Étape 9: Installation de PM2

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Mettre à jour ecosystem.config.js
nano ecosystem.config.js
```

Modifiez le fichier:
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
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
  }]
};
```

```bash
# Créer le dossier logs
mkdir -p ~/logs

# Démarrer l'application
pm2 start ecosystem.config.js

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs aqtboost

# Configurer PM2 pour démarrer au boot
pm2 startup
# Suivre les instructions affichées (copier/coller la commande)

# Sauvegarder la configuration
pm2 save
```

---

## Étape 10: Installation et configuration de Nginx

```bash
# Installer Nginx
sudo apt install -y nginx

# Créer la configuration
sudo nano /etc/nginx/sites-available/aqtboost
```

Ajoutez:
```nginx
server {
    listen 80;
    server_name 51.75.251.155;

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
    }
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/aqtboost /etc/nginx/sites-enabled/

# Supprimer la config par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Étape 11: Configuration du Firewall

```bash
# Installer UFW si pas déjà installé
sudo apt install -y ufw

# Autoriser SSH (IMPORTANT!)
sudo ufw allow 22/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Activer le firewall
sudo ufw enable

# Vérifier le statut
sudo ufw status
```

---

## Étape 12: Configuration d'un nom de domaine (Optionnel mais recommandé)

Si vous avez un nom de domaine (ex: aqtboost.com):

### Chez votre registrar (OVH, Cloudflare, etc.)
1. Créez un enregistrement A: `@` → `51.75.251.155`
2. Créez un enregistrement A: `www` → `51.75.251.155`

### Sur le VPS

```bash
# Modifier la configuration Nginx
sudo nano /etc/nginx/sites-available/aqtboost
```

Remplacez:
```nginx
server_name 51.75.251.155;
```

Par:
```nginx
server_name aqtboost.com www.aqtboost.com;
```

```bash
# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## Étape 13: Installation de SSL avec Let's Encrypt

**Seulement si vous avez un nom de domaine!**

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d aqtboost.com -d www.aqtboost.com

# Suivre les instructions (entrer votre email, accepter les termes)

# Tester le renouvellement automatique
sudo certbot renew --dry-run
```

Le SSL sera automatiquement renouvelé tous les 90 jours.

**Mettre à jour .env:**
```bash
nano /home/aqtboost/aqtboost/.env
```

Changez:
```env
NEXTAUTH_URL="https://aqtboost.com"
```

```bash
# Redémarrer l'application
pm2 restart aqtboost
```

---

## Étape 14: Créer un script de déploiement automatique

```bash
# Rendre le script exécutable
chmod +x /home/aqtboost/aqtboost/deploy.sh
```

Le fichier `deploy.sh` existe déjà, mais mettez à jour les chemins:

```bash
nano /home/aqtboost/aqtboost/deploy.sh
```

Pour déployer les mises à jour:
```bash
cd ~/aqtboost
./deploy.sh
```

---

## Commandes utiles

### Gérer l'application
```bash
# Voir les logs
pm2 logs aqtboost

# Monitoring en temps réel
pm2 monit

# Redémarrer
pm2 restart aqtboost

# Arrêter
pm2 stop aqtboost

# Supprimer
pm2 delete aqtboost
```

### Gérer Nginx
```bash
# Redémarrer
sudo systemctl restart nginx

# Vérifier la config
sudo nginx -t

# Voir les logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Gérer PostgreSQL
```bash
# Se connecter
sudo -u postgres psql aqtboost

# Backup de la base de données
pg_dump -U aqtboost_user aqtboost > backup.sql

# Restaurer
psql -U aqtboost_user aqtboost < backup.sql
```

---

## Test de l'installation

Après avoir tout configuré:

1. **Sans domaine**: Visitez http://51.75.251.155
2. **Avec domaine**: Visitez http://aqtboost.com (ou votre domaine)
3. **Avec SSL**: Visitez https://aqtboost.com

---

## Créer un compte admin

```bash
# Se connecter au VPS
ssh aqtboost@51.75.251.155

# Aller dans le dossier
cd ~/aqtboost

# Ouvrir Prisma Studio (depuis votre Mac via SSH tunnel)
# Sur votre Mac:
ssh -L 5555:localhost:5555 aqtboost@51.75.251.155

# Sur le VPS:
npx prisma studio --port 5555

# Puis ouvrez http://localhost:5555 sur votre Mac
# Créez un user avec role = "ADMIN"
```

Ou créez un compte admin via script:

```bash
# Sur le VPS
cd ~/aqtboost
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@aqtboost.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', admin.email);
  process.exit(0);
}

createAdmin();
"
```

---

## Dépannage

### L'application ne démarre pas
```bash
pm2 logs aqtboost --lines 50
```

### Erreur de connexion à la base de données
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Tester la connexion
psql -U aqtboost_user -d aqtboost -h localhost
```

### Nginx ne fonctionne pas
```bash
# Vérifier le statut
sudo systemctl status nginx

# Voir les erreurs
sudo tail -f /var/log/nginx/error.log
```

### Port 3000 déjà utilisé
```bash
# Trouver le processus
sudo lsof -i :3000

# Tuer le processus
pm2 delete aqtboost
pm2 start ecosystem.config.js
```

---

## Sécurité supplémentaire

### 1. Changer le port SSH
```bash
sudo nano /etc/ssh/sshd_config
# Changer Port 22 à Port 2222
sudo systemctl restart ssh
# Mettre à jour UFW
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### 2. Désactiver la connexion root
```bash
sudo nano /etc/ssh/sshd_config
# Changer PermitRootLogin yes à PermitRootLogin no
sudo systemctl restart ssh
```

### 3. Installer Fail2Ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## Maintenance

### Backup quotidien automatique
```bash
# Créer un script de backup
nano ~/backup.sh
```

Ajoutez:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/aqtboost/backups"
mkdir -p $BACKUP_DIR

# Backup de la base de données
pg_dump -U aqtboost_user aqtboost > $BACKUP_DIR/db_$DATE.sql

# Garder seulement les 7 derniers backups
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql"
```

```bash
chmod +x ~/backup.sh

# Ajouter au cron (backup quotidien à 2h du matin)
crontab -e
# Ajoutez:
0 2 * * * /home/aqtboost/backup.sh
```

---

## Support

En cas de problème:
1. Vérifiez les logs: `pm2 logs aqtboost`
2. Vérifiez Nginx: `sudo nginx -t`
3. Vérifiez PostgreSQL: `sudo systemctl status postgresql`
4. Consultez les fichiers de logs

---

**Votre site sera accessible à:** http://51.75.251.155

**Bon déploiement! 🚀**
