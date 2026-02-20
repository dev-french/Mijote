# 🍲 Mijote --- Application Mobile de Recettes (Offline)

![Angular](https://img.shields.io/badge/Angular-20-red)
![Ionic](https://img.shields.io/badge/Ionic-8-blue)
![Capacitor](https://img.shields.io/badge/Capacitor-8-lightblue)
![Node](https://img.shields.io/badge/Node-22-green)
![Platform](https://img.shields.io/badge/Platform-Android-brightgreen)
![SQLite](https://img.shields.io/badge/Database-SQLite-blueviolet)
![License](https://img.shields.io/badge/License-MIT-yellow)

------------------------------------------------------------------------

Application mobile Android développée avec **Ionic + Angular +
Capacitor**.\
Elle permet de gérer des recettes de cuisine en **mode 100% offline**
grâce à **SQLite**.

------------------------------------------------------------------------

## 📋 Table des matières

-   [🚀 Stack Technique](#-stack-technique)
-   [📦 Architecture](#-architecture)
-   [⚙️ Installation](#️-installation)
-   [📱 Configuration Android](#-configuration-android)
-   [🗂 Structure du Projet](#-structure-du-projet)
-   [🧠 Fonctionnement Offline](#-fonctionnement-offline)
-   [🔄 Workflow de Développement](#-workflow-de-développement)
-   [🎯 Roadmap](#-roadmap)
-   [📄 Licence](#-licence)

------------------------------------------------------------------------

## 🚀 Stack Technique

### 🖥 Frontend

-   Angular (Standalone Components)
-   Ionic Framework
-   TypeScript

### 📱 Mobile

-   Capacitor
-   Android Studio
-   Gradle

### 💾 Base de données

-   SQLite via `@capacitor-community/sqlite`

### 🛠 Environnement

-   Node.js 22 (via nvm recommandé)
-   npm
-   JetBrains PhpStorm (ou autre IDE)
-   Android Studio (installé via JetBrains Toolbox)

------------------------------------------------------------------------

## 📦 Architecture

    Angular (code app)
           ↓
    ionic build
           ↓
    www/
           ↓
    npx cap sync android
           ↓
    Projet Android natif
           ↓
    Android Studio → APK

------------------------------------------------------------------------

## ⚙️ Installation

### 1️⃣ Cloner le projet

``` bash
git clone <repo>
cd mijote-app
```

### 2️⃣ Configurer Node

``` bash
nvm install 22
nvm use 22
nvm alias default 22
```

Vérifier :

``` bash
node -v
```

### 3️⃣ Installer les dépendances

``` bash
npm install
```

### 4️⃣ Lancer en développement

``` bash
ionic serve
```

------------------------------------------------------------------------

## 📱 Configuration Android

### Installer la plateforme Android

``` bash
npm install @capacitor/android
npx cap add android
```

### Installer SQLite

``` bash
npm install @capacitor-community/sqlite
npx cap sync android
```

### Synchroniser les changements

``` bash
ionic build
npx cap copy android
```

ou

``` bash
npx cap sync android
```

### Ouvrir dans Android Studio

``` bash
npx cap open android
```

### Générer un APK debug

``` bash
cd android
./gradlew assembleDebug
```

APK généré dans :

    android/app/build/outputs/apk/debug/app-debug.apk

------------------------------------------------------------------------

## 🗂 Structure du Projet

    src/app/
     ├── core/
     │   ├── db/                → Initialisation SQLite
     │   └── recipes/           → Modèle + Repository CRUD
     ├── pages/
     │   ├── recipes-list/      → Liste des recettes
     │   ├── recipe-form/       → Ajout / édition
     │   └── recipe-detail/     → Détail recette

------------------------------------------------------------------------

## 🧠 Fonctionnement Offline

-   Stockage local via SQLite
-   Aucune API externe
-   Pas de backend en V1
-   Données conservées sur l'appareil

------------------------------------------------------------------------

## 🔄 Workflow de Développement

1.  Modifier le code Angular
2.  Exécuter :

``` bash
ionic build
npx cap copy android
```

3.  Lancer via Android Studio

------------------------------------------------------------------------

## ✅ Tests Manuels (V1 CRUD Offline)

Routes principales :

    /recipes
    /recipes/new
    /recipes/:id
    /recipes/:id/edit

Commandes :

``` bash
cd mijote-app
ionic serve
```

``` bash
cd mijote-app
ionic build
npx cap copy android
```

ou

``` bash
cd mijote-app
ionic build
npx cap sync android
```

Puis ouvrir Android Studio et lancer l'app Android.

APK debug :

    mijote-app/android/app/build/outputs/apk/debug/app-debug.apk

------------------------------------------------------------------------

## 🎯 Roadmap

-   CRUD complet des recettes
-   Recherche par ingrédient
-   Catégories & tags avancés
-   Export / import JSON
-   Synchronisation Cloud (V2)
-   Authentification utilisateur

------------------------------------------------------------------------

## 📄 Licence

MIT License

------------------------------------------------------------------------

# 👨‍🍳 Auteur

Développé par Aïssa.
