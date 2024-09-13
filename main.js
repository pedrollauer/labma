const { app, BrowserWindow } = require('electron')
const sincro = require('./backend/sincro')
const dados = require('./backend/dados.js')
const auth = require('./backend/autenticacao')
const { ipcMain } = require('electron');
const path = require('path')
const fs = require('fs')
const local = require('./backend/local.js')
let userId

//const getRootNames = dados.getRootNames
const Database  = require('./classes/database')
let win 

const firebase = require('firebase/app');
const Usuarios = require('./classes/usuarios.js');

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
    console.log(command)
    const getRootNames = new Database(command.collection)
    const names = await getRootNames.getDocuments()
    //const names = await getRootNames(command);
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

ipcMain.handle('upload-amostra', async(event, data)=>{
  console.log(data)
  auth().then(auth=>sincro.uploadArquivo(auth, data.arquivos[0]))
})

ipcMain.handle('gerar-nova-amostra', async (event, data) => {
  const { projetoId, materialId, numeroId } = data;
  
  // Process the data (e.g., save it to a database)
  console.log('Received data:', projetoId, materialId, numeroId);

  console.log(data)
  // Assume you perform some operations and get a result
  let codigoFinal, codigo
  for(let i=0; i < numeroId;i++){
    const temp = await dados.gerarCodAmostra(data, userId)
    console.log(codigo)

    if(i == 0){
      codigo = temp
      if(i == numeroId-1){break}
    }
    if(i == numeroId-1){codigoFinal = temp}
  }
  // Return the result as the response

  const nova_amostra = {codigo: codigo, erro:0, codigoFinal: codigoFinal}
  console.log(nova_amostra)
  return nova_amostra
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

 auth().then(sincro.pegarBanco).then(async(auth)=>{
    mail= await sincro.getUserEmail(auth)
    const usuarios = new Usuarios()
    userId = await usuarios.getUserByEmail(mail)
    console.log(userId)
    console.log('Logado como: '+userId)
    if(userId.id==null){
      //Não existe usuario precisamos criar!
      console.log('Erro! Usuário não cadastrado')
    }
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