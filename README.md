# 🎨 NED Studio

<div align="center">
  <img src="./assets/logo.png" alt="NED Studio Logo" width="200"/>
  
  > **Système modulaire de développement créatif**
</div>

NED Studio est une application Electron moderne qui combine un frontend React/TypeScript avec un backend Node.js/Express, offrant un environnement de développement modulaire et extensible.

## 📸 Aperçu de l'application

<div align="center">
  <img src="./assets/Capture d'écran 2025-09-13 224343.png" alt="Interface principale de NED Studio" width="800"/>
  <p><em>Interface module de NED Studio (theme par defaut)</em></p>
</div>

<div align="center">
  <img src="./assets/Capture d'écran 2025-09-13 224401.png" alt="Page de connexion" width="800"/>
  <p><em>Sidebar reduite</em></p>
</div>

<div align="center">
  <img src="./assets/Capture d'écran 2025-09-13 224604.png" alt="Système de plugins" width="800"/>
  <p><em>page des modules en darker mode</em></p>
</div>

<div align="center">
  <img src="./assets/Capture d'écran 2025-09-13 224650.png" alt="Interface utilisateur" width="800"/>
  <p><em>page des modules en light mode</em></p>
</div>

<div align="center">
  <img src="./assets/Capture d'écran 2025-09-13 224904.png" alt="Page de connexion" width="800"/>
  <p><em>page de connexion</em></p>
</div>

<div align="center">
  <img src="./assets/Capture d'écran 2025-09-13 224946.png" alt="Page d'inscription" width="800"/>
  <p><em>page d'inscription</em></p>
</div>

## 📋 Table des matières

- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🏗️ Architecture](#️-architecture)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Installation](#️-installation)
- [🔧 Développement](#-développement)
- [📦 Build et déploiement](#-build-et-déploiement)
- [🔐 Authentification](#-authentification)
- [🧩 Système de plugins](#-système-de-plugins)
- [📚 Documentation](#-documentation)
- [🤝 Contribution](#-contribution)

## 🚀 Démarrage rapide

```bash
# Cloner le projet
git clone https://github.com/Nkounga42/NED-studio.git
cd NED-studio

# Installation des dépendances
npm install

# Démarrer l'application complète (frontend + backend)
npm run dev
```

L'application sera accessible à l'adresse configurée dans le frontend Electron.

## 🏗️ Architecture

NED Studio suit une architecture modulaire avec séparation claire des responsabilités :

```
NED-studio/
├── 📁 frontend/          # Application Electron (React + TypeScript)
├── 📁 backend/           # API REST (Node.js + Express + MongoDB)
├── 📄 package.json      # Scripts de gestion globale
└── 📄 README.md         # Documentation principale
```

### Stack technologique

**Frontend (Electron)**
- ⚛️ React 18 avec TypeScript
- 🎨 DaisyUI + Tailwind CSS
- 🔄 Framer Motion (animations)
- 🛣️ React Router (navigation)
- 🔔 Sonner (notifications)

**Backend (API)**
- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT (authentification)
- 🔒 bcryptjs (hachage)
- 🌐 CORS activé

## ✨ Fonctionnalités

### 🔐 Système d'authentification complet
- ✅ Connexion/inscription avec validation
- ✅ Gestion des sessions persistantes
- ✅ Protection des routes
- ✅ Interface utilisateur avec header personnalisé
- ✅ Redirection automatique selon l'état de connexion

### 🧩 Architecture modulaire
- ✅ Système de plugins extensible
- ✅ Composants réutilisables
- ✅ Hooks personnalisés
- ✅ Configuration flexible

### 🎨 Interface moderne
- ✅ Design responsive avec DaisyUI
- ✅ Animations fluides avec Framer Motion
- ✅ Thème sombre/clair
- ✅ Notifications toast intégrées

## 🛠️ Installation

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- MongoDB (local ou distant)

### Installation complète

```bash
# 1. Cloner le repository
git clone https://github.com/Nkounga42/NED-studio.git
cd NED-studio

# 2. Installer les dépendances globales
npm install

# 3. Installer les dépendances du backend
cd backend
npm install

# 4. Installer les dépendances du frontend
cd ../frontend
npm install

# 5. Retourner à la racine
cd ..
```

### Configuration

1. **Backend** : Créer un fichier `.env` dans le dossier `backend/`
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/nedstudio
JWT_SECRET=votre_secret_jwt_ici
```

2. **Frontend** : La configuration se trouve dans les fichiers de configuration Electron

## 🔧 Développement

### Scripts disponibles

```bash
# Démarrer l'application complète (recommandé)
npm run dev
# ou
npm run studio

# Démarrer uniquement le backend
npm run server

# Démarrer uniquement le frontend
npm run client

# Build de production
npm run build
```

### Structure de développement

- **Frontend** : Port par défaut Electron
- **Backend** : Port 3001 (configurable via .env)
- **Base de données** : MongoDB sur port 27017

## 📦 Build et déploiement

### Build du frontend

```bash
cd frontend

# Windows
npm run build:win

# macOS  
npm run build:mac

# Linux
npm run build:linux
```

### Déploiement du backend

Le backend peut être déployé sur n'importe quelle plateforme supportant Node.js (Heroku, Vercel, DigitalOcean, etc.).

## 🔐 Authentification

Le système d'authentification inclut :

- **Routes protégées** : `/app`, `/plugins`, `/settings`
- **Routes publiques** : `/login`, `/register`
- **Comptes de démonstration** :
  - `admin` / `password`
  - `demo` / `demo123`

### Flux d'authentification

1. Utilisateur non connecté → redirection vers `/login`
2. Connexion réussie → redirection vers `/app`
3. Header avec informations utilisateur affiché
4. Déconnexion → retour vers `/login`

## 🧩 Système de plugins

NED Studio dispose d'un système de plugins extensible permettant d'ajouter facilement de nouvelles fonctionnalités.

Consultez le [guide de développement de plugins](./frontend/README-PLUGIN-DEVELOPMENT.md) pour plus d'informations.

## 📚 Documentation

### Documentation détaillée

- 📖 [Frontend README](./frontend/README.md) - Configuration et développement Electron
- 📖 [Backend README](./backend/README.md) - API et base de données
- 📖 [Guide des plugins](./frontend/README-PLUGIN-DEVELOPMENT.md) - Développement de plugins

### Ressources utiles

- [Documentation Electron](https://www.electronjs.org/docs)
- [Documentation React](https://react.dev)
- [Documentation DaisyUI](https://daisyui.com)
- [Documentation Express](https://expressjs.com)

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de code

- Utiliser TypeScript pour le frontend
- Suivre les conventions ESLint configurées
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter les nouvelles API

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Gil Nkounga**
- Email: nkoungagil@gmail.com
- GitHub: [@Nkounga42](https://github.com/Nkounga42)

## 🔗 Liens utiles

- [Repository GitHub](https://github.com/Nkounga42/NED-studio)
- [Issues](https://github.com/Nkounga42/NED-studio/issues)
- [Releases](https://github.com/Nkounga42/NED-studio/releases)

---

<div align="center">
  <strong>Développé avec ❤️ par l'équipe NED Studio</strong>
</div>
