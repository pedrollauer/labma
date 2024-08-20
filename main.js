const { app, BrowserWindow } = require('electron')
const sincro = require('./backend/sincro')
const dados = require('./backend/dados.js')
const auth = require('./backend/autenticacao')
const { ipcMain } = require('electron');
const path = require('path')
const getRootNames = dados.getRootNames
let win 
// Quando o evento 'get-root-names' for solicitado, obtenha os nomes e os envie de volta
ipcMain.handle('get-root-names', async (event, command) => {
    const names = await getRootNames(command);
    return names;
});


ipcMain.handle('gerar-nova-amostra', async (event, data) => {
  const { projetoId, materialId, numero } = data;
  
  // Process the data (e.g., save it to a database)
  console.log('Received data:', projetoId, materialId, numero);

  // Assume you perform some operations and get a result
  const result = { message: 'Form submitted successfully' };
  const nova_amostra = await dados.gerarCodAmostra(data)

  await auth().then(sincro.uploadDB).then(()=>{console.log('Upload feito!')}).catch((err)=>{
    console.log(err)
    nova_amostra = {erro: 1}
  })

  //const nova_amostra = {project: "A1",student: "PL", material:"SS1", number:"001"}
  // Return the result as the response
  return nova_amostra;
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
