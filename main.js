const { app, BrowserWindow } = require('electron')
const sincro = require('./backend/sincro')
const dados = require('./backend/dados.js')
const auth = require('./backend/autenticacao')
const { ipcMain } = require('electron');
const path = require('path')
const fs = require('fs')
const getRootNames = dados.getRootNames
let win 

const firebase = require('firebase/app');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmebVjB5Ke1Atr_wjPawC5hhZ8ixIxVBo",
  authDomain: "cliente-52567.firebaseapp.com",
  projectId: "cliente-52567",
  storageBucket: "cliente-52567.appspot.com",
  messagingSenderId: "1068658652797",
  appId: "1:1068658652797:web:1f54ae998a1b8178e0e314"
};

// Quando o evento 'get-root-names' for solicitado, obtenha os nomes e os envie de volta
ipcMain.handle('get-root-names', async (event, command) => {
    const names = await getRootNames(command);
    return names;
});

ipcMain.handle('gdrive-connect', async(event, command)=>{
  console.log("Tentando novamente...")
  authenticate()
})

ipcMain.handle('novo-documento', async (event, command) => {
    console.log('ADYORNO')
    console.log(command)
    const authenticate = await auth()
    await sincro.uploadArquivo(authenticate,command.arquivos[0],command.nome)
    .then(()=>console.log("Upload completo!"))
    .catch(err=>console.log(err))
    return command;
});

ipcMain.handle('gerar-nova-amostra', async (event, data) => {
  const { projetoId, materialId, numero } = data;
  
  // Process the data (e.g., save it to a database)
  console.log('Received data:', projetoId, materialId, numero);

  // Assume you perform some operations and get a result
  const result = { message: 'Form submitted successfully' };
  let nova_amostra = await dados.gerarCodAmostra(data)

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

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);

}).then(()=>{

  authenticate()
 
})

function authenticate(){

 auth().then(sincro.pegarBanco).then(()=>{
    win.loadFile("frontend/main.html")
 }).catch((err)=>{
  if(err == 'invalid_grant'){
    console.log('Deletando token invalido')
    const tokenPath = path.join(__dirname,'./seguranca','token.json')
    fs.unlink(tokenPath,(err)=>{
      if(err){
        console.log(err)
        return
      }
      console.log('Token deletado')
      authenticate()
    })
  }
      // We send a message to the frontend.
      win.webContents.send('update-status', 'Error');    
  console.log("Adornou!")
});
}