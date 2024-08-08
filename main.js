const { app, BrowserWindow } = require('electron')
const sincro = require('./backend/sincro')
const auth = require('./backend/autenticacao')

  let win = 
app.whenReady().then(() => {

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true, // Enable nodeIntegration
        contextIsolation: false, // Disable contextIsolation
    }
  })

  win.loadFile('frontend/index.html')
  win.webContents.send('update-status', 'Loading files...');

}).then(()=>{

 auth().then(sincro.pegarBanco).then(()=>{
    win.webContents.send('update-status', 'Done.');
 }).catch(console.error);
})
