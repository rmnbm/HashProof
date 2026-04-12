# HashProof

HashProof est une application web de gestion d'empreintes cryptographiques. L'application permet d'enregistrer une empreinte `SHA-256` à partir d'un texte, de conserver cet enregistrement en base de données, puis de vérifier ultérieurement si un contenu correspond à l'empreinte de référence.

## Présentation

Le projet repose sur une architecture séparée frontend/backend :

- un frontend en Vue.js 3 pour l'interface utilisateur
- un backend en Node.js avec Fastify pour l'API REST
- une base MongoDB pour la persistance des données

L'objectif fonctionnel est de fournir une interface simple pour :

- créer une empreinte via un formulaire
- enregistrer des métadonnées associées au contenu
- consulter les enregistrements existants
- vérifier l'intégrité d'un texte à partir d'une empreinte déjà stockée
- supprimer un enregistrement de l'archive

## Technologies

- Vue.js 3
- Vite
- Vue Router
- Pinia
- Node.js
- Fastify
- MongoDB
- Mongoose

## Fonctionnalités

- page d'accueil avec présentation et statistiques
- page de création d'une empreinte
- page d'archive avec filtrage et suppression
- page de vérification d'intégrité
- API REST avec routes `GET`, `POST` et `DELETE`

## Structure du projet

```text
.
|- client/
|- mongo-init/
|- server/
|- docker-compose.yml
|- package.json
`- turbo.json
```

## Variables d'environnement

### Backend

Le backend utilise les variables suivantes :

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=
APP_BASE_URL=http://localhost:5173
CLIENT_ORIGINS=http://localhost:5173
```

### Frontend

Le frontend utilise la variable suivante :

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Exécution locale

Installation des dépendances :

```bash
npm install
```

Lancement du backend :

```bash
cd server
npm run dev
```

Lancement du frontend :

```bash
cd client
npm run dev
```

Le frontend est servi par Vite sur le port `5173` et l'API Fastify sur le port `3000`.

## API

Routes principales :

- `GET /api/fingerprints`
- `GET /api/fingerprints/stats`
- `GET /api/fingerprints/:id`
- `POST /api/fingerprints`
- `POST /api/fingerprints/:id/verify`
- `DELETE /api/fingerprints/:id`

## Déploiement

Le frontend est prévu pour un déploiement sur Netlify et le backend sur Render.

### Frontend

- base directory : `client`
- build command : `npm run build`
- publish directory : `dist`

Variable d'environnement :

```env
VITE_API_BASE_URL=https://<backend-render>
```

### Backend

- root directory : `server`
- build command : `npm install`
- start command : `npm run start`

Variables d'environnement :

```env
NODE_ENV=production
MONGODB_URI=
APP_BASE_URL=https://<frontend-netlify>
CLIENT_ORIGINS=https://<frontend-netlify>
```
