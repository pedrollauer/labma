// index.js
const { ipcRenderer } = require('electron');
const spinnerElement = document.getElementById('spinner');
const btnRetry = document.getElementById('btnRetry')
btnRetry.addEventListener('click', ()=>{
    console.log('Listen')            
    const data = ipcRenderer.invoke('gdrive-connect'); 
    btnRetry.style.display = "none"
    spinnerElement.style.display = 'block'
    document.getElementById('status').innerText = "Carregando Arquivos";


})
console.log(document.getElementById('spinner'))
// Update the status message when the main process sends a message
ipcRenderer.on('update-status', (event, message) => {
    document.getElementById('status').innerText = message;
    // Escondemos o spinner se deu tudo certo
    if (message === 'Done.' || message === 'Error occurred.') {
        spinnerElement.classList.add('hidden');
    }

    else if(message === 'Error'){
        document.getElementById('status').innerText = "Erro de conexão com o Google Drive";
        spinnerElement.style.display = "none"
        btnRetry.style.display = "block"
        console.log('Error!!!')
    }
});
