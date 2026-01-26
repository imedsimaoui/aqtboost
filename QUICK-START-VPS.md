# Quick Start - Déploiement VPS sur le port 3002

## Pour votre VPS avec plusieurs sites (51.75.251.155)

### Étape 1: Upload du code

```bash
# Sur votre Mac
cd /Users/simaouiimed/boosting
git add .
git commit -m "Configuration port 3002"
git push origin main
```

### Étape 2: Sur le VPS

```bash
# Connexion SSH
ssh aqtboost@51.75.251.155

# Clone ou pull du repo
cd ~
git clone https://github.com/imedsimaoui/aqtboost.git
# OU si déjà cloné:
cd aqtboost
git pull origin main
```

### Étape 3: Configuration automatique

```bash
cd ~/aqtboost

# Créer le fichier .env
nano .env
```

Ajoutez:
```env
DATABASE_URL="postgresql://aqtboost_user:VOTRE_MOT_DE_PASSE@localhost:5432/aqtboost"
NEXTAUTH_SECRET="GENERER_UNE_CLE_AVEC_OPENSSL"
NEXTAUTH_URL="http://51.75.251.155:3002"
NODE_ENV="production"
PORT=3002
```

Pour générer NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Étape 4: Lancer le script de setup

```bash
chmod +x setup-port-3002.sh
./setup-port-3002.sh
```

Ce script va automatiquement:
- Vérifier la configuration
- Ouvrir le port 3002 dans le firewall
- Installer les dépendances
- Générer Prisma Client
- Exécuter les migrations
- Builder l'application
- Démarrer PM2

### Étape 5: Accéder au site

Ouvrez votre navigateur: **http://51.75.251.155:3002**

---

## Vérification

```bash
# Vérifier que l'app tourne
pm2 status

# Voir les logs
pm2 logs aqtboost

# Tester localement
curl http://localhost:3002
```

---

## En cas de problème

### L'application ne démarre pas
```bash
pm2 logs aqtboost --lines 50
```

### Le port est déjà utilisé
```bash
sudo lsof -i :3002
pm2 delete aqtboost
pm2 start ecosystem.config.js
```

### Erreur de base de données
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Tester la connexion
psql -U aqtboost_user -d aqtboost -h localhost
```

### Rebuild complet
```bash
cd ~/aqtboost
pm2 stop aqtboost
npm run build
pm2 restart aqtboost
```

---

## Commandes utiles

```bash
# Redémarrer l'app
pm2 restart aqtboost

# Arrêter l'app
pm2 stop aqtboost

# Voir les logs en temps réel
pm2 logs aqtboost --lines 100

# Monitoring
pm2 monit

# Mettre à jour le code
cd ~/aqtboost
git pull origin main
npm install
npm run build
pm2 restart aqtboost
```

---

## Créer un compte admin

```bash
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
  console.log('Password: admin123');
  console.log('IMPORTANT: Change this password after first login!');
  process.exit(0);
}

createAdmin();
"
```

Puis connectez-vous avec:
- Email: admin@aqtboost.com
- Password: admin123

**⚠️ IMPORTANT: Changez le mot de passe immédiatement après la première connexion!**

---

## Support

- Guide complet: `DEPLOY-OVH.md`
- Multi-sites: `MULTI-SITE-NGINX.md`
- Diagnostic VPS: `./check-vps.sh`

**Votre site sera accessible à:** http://51.75.251.155:3002
