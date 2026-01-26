# Configuration Multi-Sites sur VPS OVH

## Situation
Vous avez plusieurs sites sur le même VPS. AQTBOOST doit coexister avec vos autres sites.

## Solution 1: Sous-domaine (Recommandé)

### Si vous avez un domaine (ex: votredomaine.com)

**Créez un sous-domaine:** `aqtboost.votredomaine.com` ou `boost.votredomaine.com`

#### 1. Configuration DNS
Chez votre registrar (OVH, Cloudflare, etc.), ajoutez un enregistrement A:
```
Type: A
Nom: aqtboost
Valeur: 51.75.251.155
TTL: Auto
```

#### 2. Configuration Nginx sur le VPS

```bash
# Connectez-vous au VPS
ssh aqtboost@51.75.251.155

# Créer la configuration
sudo nano /etc/nginx/sites-available/aqtboost
```

Contenu du fichier:
```nginx
server {
    listen 80;
    server_name aqtboost.votredomaine.com;

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

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

#### 3. Mettre à jour .env

```bash
nano ~/aqtboost/.env
```

Changez:
```env
NEXTAUTH_URL="http://aqtboost.votredomaine.com"
```

```bash
# Redémarrer l'application
pm2 restart aqtboost
```

#### 4. Installer SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d aqtboost.votredomaine.com
```

Puis mettez à jour .env:
```env
NEXTAUTH_URL="https://aqtboost.votredomaine.com"
```

---

## Solution 2: Port différent (Sans domaine)

Si vous n'avez pas de domaine, utilisez un port différent.

### 1. Changer le port de l'application

```bash
# Sur le VPS
nano ~/aqtboost/.env
```

Ajoutez/modifiez:
```env
PORT=3002
NEXTAUTH_URL="http://51.75.251.155:3002"
```

### 2. Modifier ecosystem.config.js

```bash
nano ~/aqtboost/ecosystem.config.js
```

Changez:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3002  // Changez de 3000 à 3002
}
```

### 3. Ouvrir le port dans le firewall

```bash
sudo ufw allow 3002/tcp
```

### 4. Configuration Nginx (optionnelle mais recommandée)

```bash
sudo nano /etc/nginx/sites-available/aqtboost
```

```nginx
server {
    listen 3002;
    server_name 51.75.251.155;

    location / {
        proxy_pass http://localhost:3002;
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
sudo ln -s /etc/nginx/sites-available/aqtboost /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Redémarrer l'application

```bash
pm2 restart aqtboost
```

**Accès:** http://51.75.251.155:3002

---

## Solution 3: Path (Sous-chemin)

Utiliser un path comme `http://51.75.251.155/aqtboost`

### 1. Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

Ajoutez dans le bloc `server`:
```nginx
location /aqtboost {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Important pour Next.js
    rewrite ^/aqtboost/(.*)$ /$1 break;
}
```

### 2. Modifier next.config.mjs

```bash
nano ~/aqtboost/next.config.mjs
```

Ajoutez:
```javascript
const nextConfig = {
  basePath: '/aqtboost',
  assetPrefix: '/aqtboost',
  // ... reste de la config
};
```

### 3. Rebuild et restart

```bash
cd ~/aqtboost
npm run build
pm2 restart aqtboost
sudo systemctl restart nginx
```

**Accès:** http://51.75.251.155/aqtboost

---

## Vérifier la configuration actuelle

### 1. Voir quels ports sont utilisés

```bash
sudo lsof -i -P -n | grep LISTEN
```

### 2. Voir les sites Nginx configurés

```bash
ls -la /etc/nginx/sites-enabled/
```

### 3. Voir quelle config Nginx écoute sur le port 80

```bash
grep -r "listen 80" /etc/nginx/sites-enabled/
```

### 4. Vérifier PM2

```bash
pm2 list
pm2 logs aqtboost
```

---

## Recommandation

**Option 1 (Sous-domaine)** est la meilleure si vous avez un domaine:
- URL propre: `aqtboost.votredomaine.com`
- Facile à gérer
- SSL gratuit avec Let's Encrypt
- Professionnel

**Option 2 (Port différent)** si pas de domaine:
- Simple et rapide
- URL: `http://51.75.251.155:3002`
- Pas besoin de domaine

**Option 3 (Path)** en dernier recours:
- Plus complexe
- Nécessite des modifications du code
- URL: `http://51.75.251.155/aqtboost`

---

## Diagnostic des problèmes

### Erreur 404 Not Found

**Cause probable:** Nginx ne redirige pas vers votre application

```bash
# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log

# Vérifier si l'application tourne
pm2 status
curl http://localhost:3000  # Doit retourner du HTML

# Vérifier la config Nginx
sudo nginx -t
```

### L'application ne démarre pas

```bash
# Voir les logs
pm2 logs aqtboost

# Vérifier les erreurs
cd ~/aqtboost
npm run build  # Voir si le build fonctionne
```

### Conflit de port

```bash
# Voir ce qui utilise le port 3000
sudo lsof -i :3000

# Changer le port dans .env et ecosystem.config.js
```

---

## Quick Fix pour votre situation

Puisque vous avez déjà des sites, la solution la plus rapide:

```bash
# Sur le VPS
cd ~/aqtboost

# Changer le port
nano .env
# Ajoutez: PORT=3002
# Ajoutez: NEXTAUTH_URL="http://51.75.251.155:3002"

# Modifier PM2
nano ecosystem.config.js
# Changez env.PORT à 3002

# Ouvrir le port
sudo ufw allow 3002/tcp

# Rebuild et restart
npm run build
pm2 restart aqtboost

# Tester
curl http://localhost:3002
```

Puis accédez à: **http://51.75.251.155:3002**
