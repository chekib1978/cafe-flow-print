
# Instructions de Build et Déploiement

## Build Automatique avec GitHub Actions

Ce projet utilise GitHub Actions pour automatiser le processus de build et de déploiement.

### Artifacts Disponibles

À chaque push sur la branche principale, GitHub Actions génère automatiquement :

1. **cafeteria-app-build** : Build standard pour déploiement web
2. **cafeteria-app-portable** : Version portable pour clé USB avec scripts de lancement

### Comment Télécharger les Builds

1. Allez dans l'onglet **Actions** de votre repository GitHub
2. Cliquez sur le workflow le plus récent
3. Descendez jusqu'à la section **Artifacts**
4. Téléchargez l'artifact souhaité

### Application Desktop (Optionnelle)

Pour créer une application desktop Windows, vous pouvez installer Electron séparément :

```bash
# Installer Electron pour le développement desktop (optionnel)
npm install --save-dev electron electron-builder

# Développement desktop (si Electron est installé)
npm run electron-dev

# Build desktop Windows (si Electron est installé)
npm run electron-pack-win
```

#### Fonctionnalités Desktop (si configuré)
- ✅ **100% hors ligne** (base de données SQLite intégrée)
- ✅ **Installation native** sur Windows
- ✅ **Menus natifs** et raccourcis clavier
- ✅ **Zoom** (Ctrl + Plus/Moins)
- ✅ **Sécurité renforcée** avec Electron

### Version Portable

L'artifact `cafeteria-app-portable` contient :
- Tous les fichiers de l'application
- `run.bat` pour Windows
- `README.txt` avec les instructions

### Déploiement GitHub Pages

L'application est automatiquement déployée sur GitHub Pages à l'adresse :
`https://[votre-username].github.io/[nom-du-repo]`

### Build Local

Pour créer un build localement :

```bash
# Installer les dépendances
npm install

# Build web
npm run build

# Servir localement
npm run dev
```

### Utilisation des Applications

#### Version Web
1. **GitHub Pages** : Accès direct via l'URL
2. **Portable** : Ouvrez `index.html` ou utilisez le script `run.bat`
3. **Local** : Utilisez `npm run dev` pour le développement

#### Version Desktop (Optionnelle)
Si vous avez installé Electron :
1. **Développement** : `npm run electron-dev`
2. **Build Windows** : `npm run electron-pack-win`

## Configuration GitHub Pages

Pour activer GitHub Pages :
1. Allez dans Settings > Pages
2. Sélectionnez "GitHub Actions" comme source
3. L'URL sera disponible après le premier déploiement

## Résolution des Problèmes

### Erreurs d'installation Electron
Si vous rencontrez des erreurs avec Electron :
1. Electron n'est pas requis pour l'application web principale
2. Vous pouvez utiliser l'application via GitHub Pages ou en mode portable
3. L'installation d'Electron est optionnelle pour les fonctionnalités desktop

### Build qui échoue
Si le build échoue :
1. Vérifiez que toutes les dépendances sont installées : `npm ci`
2. Essayez de nettoyer et réinstaller : `rm -rf node_modules package-lock.json && npm install`
3. Vérifiez les logs GitHub Actions pour identifier l'erreur précise
