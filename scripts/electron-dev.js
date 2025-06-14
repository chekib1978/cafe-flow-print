
const { spawn } = require('child_process');
const { createServer } = require('vite');

async function startElectronDev() {
  console.log('Démarrage du serveur Vite...');
  
  // Démarrer le serveur Vite
  const server = await createServer({
    configFile: 'vite.config.ts'
  });
  
  await server.listen(5173);
  console.log('Serveur Vite démarré sur http://localhost:5173');
  
  // Attendre un peu que le serveur soit prêt
  setTimeout(() => {
    console.log('Démarrage d\'Electron...');
    
    // Démarrer Electron
    const electronProcess = spawn('npx', ['electron', 'electron/main.js'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });
    
    electronProcess.on('close', () => {
      server.close();
      process.exit();
    });
  }, 2000);
}

startElectronDev().catch(console.error);
