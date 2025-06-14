
# Instructions de Build et Déploiement

## Build Automatique avec GitHub Actions

Ce projet utilise GitHub Actions pour automatiser le processus de build et de déploiement.

### Artifacts Disponibles

À chaque push sur la branche principale, GitHub Actions génère automatiquement :

1. **cafeteria-app-build** : Build standard pour déploiement web
2. **cafeteria-app-portable** : Version portable pour clé USB avec scripts de lancement
3. **cafeteria-app-desktop-windows** : Application desktop Windows (.exe)
4. **cafeteria-app-desktop-macos** : Application desktop macOS (.dmg)
5. **cafeteria-app-desktop-linux** : Application desktop Linux (.AppImage)

### Comment Télécharger les Builds

1. Allez dans l'onglet **Actions** de votre repository GitHub
2. Cliquez sur le workflow le plus récent
3. Descendez jusqu'à la section **Artifacts**
4. Téléchargez l'artifact souhaité

### Applications Desktop

Les applications desktop sont créées automatiquement pour :
- **Windows** : Installateur `.exe` 
- **macOS** : Package `.dmg`
- **Linux** : Application portable `.AppImage`

#### Fonctionnalités Desktop
- ✅ **100% hors ligne** (base de données SQLite intégrée)
- ✅ **Installation native** sur chaque plateforme
- ✅ **Menus natifs** et raccourcis clavier
- ✅ **Zoom** (Ctrl/Cmd + Plus/Moins)
- ✅ **Sécurité renforcée** avec Electron
- ✅ **Auto-updater** (optionnel)

### Version Portable

L'artifact `cafeteria-app-portable` contient :
- Tous les fichiers de l'application
- `run.bat` pour Windows
- `run.sh` pour Linux/Mac  
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

# Build desktop (toutes plateformes)
npm run electron-pack

# Build desktop (plateforme spécifique)
npm run electron-pack-win    # Windows uniquement
npm run electron-pack-mac    # macOS uniquement  
npm run electron-pack-linux  # Linux uniquement

# Développement desktop
npm run electron-dev
```

### Utilisation des Applications

#### Version Web
1. **GitHub Pages** : Accès direct via l'URL
2. **Portable** : Ouvrez `index.html` ou utilisez les scripts `run.bat`/`run.sh`

#### Version Desktop
1. **Windows** : Double-cliquez sur le fichier `.exe` téléchargé
2. **macOS** : Ouvrez le fichier `.dmg` et glissez l'app dans Applications
3. **Linux** : Rendez le fichier `.AppImage` exécutable et lancez-le

## Configuration GitHub Pages

Pour activer GitHub Pages :
1. Allez dans Settings > Pages
2. Sélectionnez "GitHub Actions" comme source
3. L'URL sera disponible après le premier déploiement
