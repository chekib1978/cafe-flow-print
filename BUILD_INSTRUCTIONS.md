
# Instructions de Build et Déploiement

## Build Automatique avec GitHub Actions

Ce projet utilise GitHub Actions pour automatiser le processus de build et de déploiement.

### Artifacts Disponibles

À chaque push sur la branche principale, GitHub Actions génère automatiquement :

1. **cafe-pro-build** : Build standard pour déploiement web
2. **cafe-pro-portable** : Version portable pour clé USB avec scripts de lancement
3. **cafe-pro-desktop-windows** : Application desktop Windows (.exe)

### Comment Télécharger les Builds

1. Allez dans l'onglet **Actions** de votre repository GitHub
2. Cliquez sur le workflow le plus récent
3. Descendez jusqu'à la section **Artifacts**
4. Téléchargez l'artifact souhaité

### Application Desktop

L'application desktop est automatiquement buildée avec Electron et disponible en téléchargement :

```bash
# Développement desktop local
npm run electron-dev

# Build desktop Windows local
npm run electron-pack-win
```

#### Fonctionnalités Desktop
- ✅ **100% hors ligne** (base de données SQLite intégrée)
- ✅ **Installation native** sur Windows
- ✅ **Menus natifs** et raccourcis clavier
- ✅ **Zoom** (Ctrl + Plus/Moins)
- ✅ **Sécurité renforcée** avec Electron

### Version Portable

L'artifact `cafe-pro-portable` contient :
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

#### Version Desktop
1. **Téléchargement** : Récupérez `cafe-pro-desktop-windows` depuis GitHub Actions
2. **Installation** : Exécutez le fichier `.exe` téléchargé
3. **Développement local** : `npm run electron-dev`

## Configuration GitHub Pages

Pour activer GitHub Pages :
1. Allez dans Settings > Pages
2. Sélectionnez "GitHub Actions" comme source
3. L'URL sera disponible après le premier déploiement

## Résolution des Problèmes

### Build qui échoue
Si le build échoue :
1. Vérifiez que toutes les dépendances sont installées : `npm ci`
2. Essayez de nettoyer et réinstaller : `rm -rf node_modules package-lock.json && npm install`
3. Vérifiez les logs GitHub Actions pour identifier l'erreur précise

### Problèmes Electron
Si vous rencontrez des erreurs avec Electron :
1. Assurez-vous que Node.js est en version 18 ou supérieure
2. Vérifiez que Python et les build tools sont installés pour la compilation native
3. Consultez les logs détaillés dans GitHub Actions

