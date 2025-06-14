
# Instructions de Build et Déploiement

## Build Automatique avec GitHub Actions

Ce projet utilise GitHub Actions pour automatiser le processus de build et de déploiement.

### Artifacts Disponibles

À chaque push sur la branche principale, GitHub Actions génère automatiquement :

1. **cafeteria-app-build** : Build standard pour déploiement web
2. **cafeteria-app-portable** : Version portable pour clé USB avec scripts de lancement
3. **cafeteria-app-desktop-windows** : Application desktop Windows (.exe)

### Comment Télécharger les Builds

1. Allez dans l'onglet **Actions** de votre repository GitHub
2. Cliquez sur le workflow le plus récent
3. Descendez jusqu'à la section **Artifacts**
4. Téléchargez l'artifact souhaité

### Application Desktop Windows

L'application desktop Windows est créée automatiquement :
- **Windows** : Installateur `.exe` 

#### Fonctionnalités Desktop
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

# Build desktop Windows
npm run electron-pack-win

# Développement desktop
npm run electron-dev
```

### Utilisation des Applications

#### Version Web
1. **GitHub Pages** : Accès direct via l'URL
2. **Portable** : Ouvrez `index.html` ou utilisez le script `run.bat`

#### Version Desktop Windows
1. **Windows** : Double-cliquez sur le fichier `.exe` téléchargé pour l'installer

## Configuration GitHub Pages

Pour activer GitHub Pages :
1. Allez dans Settings > Pages
2. Sélectionnez "GitHub Actions" comme source
3. L'URL sera disponible après le premier déploiement

## Résolution des Problèmes

Si le build échoue :
1. Vérifiez que les scripts `electron-pack-win` et `electron-dev` existent dans package.json
2. Assurez-vous qu'Electron et electron-builder sont installés
3. Vérifiez les logs GitHub Actions pour identifier l'erreur précise
