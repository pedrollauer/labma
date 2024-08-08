// index.js
const { ipcRenderer } = require('electron');
const spinnerElement = document.getElementById('spinner');


// Update the status message when the main process sends a message
ipcRenderer.on('update-status', (event, message) => {
    document.getElementById('status').innerText = message;
    // Escondemos o spinner se deu tudo certo
    if (message === 'Done.' || message === 'Error occurred.') {
        spinnerElement.classList.add('hidden');
    }
});
