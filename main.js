const { app, BrowserWindow } = require('electron')
const sincro = require('./backend/sincro')
const getRootNames = require('./backend/dados.js')
const auth = require('./backend/autenticacao')
const { ipcMain } = require('electron');
const path = require('path')

let win 
// Quando o evento 'get-root-names' for solicitado, obtenha os nomes e os envie de volta
ipcMain.handle('get-root-names', async (event, command) => {
    const names = await getRootNames(command);
    return names;
});


ipcMain.handle('gerar-nova-amostra', async (event, data) => {
  const { projetoId, materialId } = data;
  
  // Process the data (e.g., save it to a database)
  console.log('Received data:', projetoId, materialId);

  // Assume you perform some operations and get a result
  const result = { message: 'Form submitted successfully' };

  // Return the result as the response
  return 120;
});

app.whenReady().then(() => {

  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', 'labma_logo.png'),
    webPreferences: {
        nodeIntegration: true, // Enable nodeIntegration
        contextIsolation: false, // Disable contextIsolation
    }
  })

  win.loadFile('frontend/index.html')
  win.webContents.send('update-status', 'Carregando Arquivos...');

}).then(()=>{

 auth().then(sincro.pegarBanco).then(()=>{
    //win.webContents.send('update-status', 'Done.');
    win.loadFile("frontend/main.html")
 }).catch(console.error);
})
