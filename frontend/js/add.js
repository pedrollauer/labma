const { ipcRenderer } = require('electron');
// Array to store file paths
let filePaths = [];

// Get references to the select element and the drop area
const categorySelect = document.getElementById('category-select');
const fileDropArea = document.getElementById('file-drop-area');
const newCodeArea = document.getElementById('new-code-area');
const fileListContainer = document.getElementById('file-list');
// Get references to the form divs
const formAmostra = document.getElementById('form-amostra');
const formAtuaAmostra = document.getElementById('form-atua-amostra');
const formDocumento = document.getElementById('form-documento');
const formAmostraGerar = document.getElementById('form-amostra-gerar');
const formAmostraProjeto = document.getElementById('form-amostra-projeto');
const formAmostraMaterial = document.getElementById('form-amostra-material');
const formAmostraNumero = document.getElementById('form-amostra-numero');

// Buttons
       const btnGerar = document.getElementById('btn-mais-um')
       btnGerar.addEventListener('click', () => {
       
       categorySelect.value = 1
       const event = new Event('change')
       categorySelect.dispatchEvent(event)
       formAmostraNumero.value = 0
       formAmostraProjeto.value = 0
       formAmostraMaterial.value = 0

    })

// Function to hide all forms
function hideAllForms() {
    formAmostra.style.display = 'none';
    formAtuaAmostra.style.display = 'none';
    formDocumento.style.display = 'none';
    newCodeArea.style.display = 'none'
}

// Show the drop area when an option is selected
categorySelect.addEventListener('change', () => {

    const selectedValue = parseInt(categorySelect.value, 10);
    if(selectedValue > 1){
        fileDropArea.style.display = 'block';
    }

    if(selectedValue == 1){
       resetarNovaAmostra()
        fileDropArea.style.display = 'none';
        command = {
            query: "Select * from projetos"
        }

        fetchData(command).then((data)=>{
            const selectElement = document.getElementById('form-amostra-projeto');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nome;
                selectElement.appendChild(option);
            });
        })

        fetchData({query:"Select * from materiais"}).then((data)=>{
            console.log(data)
            const selectElement = document.getElementById('form-amostra-material');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nome;
                selectElement.appendChild(option);
            });
        }).catch((e)=>{
            console.log(e)
        })



    }

    hideAllForms()
    // Show the corresponding form based on the selected option
    if (selectedValue === 1) {
        formAmostra.style.display = 'block';
    } else if (selectedValue === 2) {
        formAtuaAmostra.style.display = 'block';
    } else if (selectedValue === 3) {
        formDocumento.style.display = 'block';
    }
});

// Handle file dropping
fileDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    fileDropArea.style.borderColor = '#00f';  // Change border color on hover
});

fileDropArea.addEventListener('dragleave', () => {
    fileDropArea.style.borderColor = '#ccc';  // Revert border color when not hovering
});

fileDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    fileDropArea.style.borderColor = '#ccc';  // Revert border color

    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const filePath = files[i].path;
        filePaths.push(filePath); // Store file paths

        // Create a new line for the file
        const fileLine = document.createElement('div');
        fileLine.classList.add('file-line');

        // Create a file icon
        const fileIcon = document.createElement('span');
        fileIcon.innerHTML = '📄';  // Unicode character for file icon
        fileIcon.classList.add('file-icon'); 

        // Create input field for renaming the file
        const fileInput = document.createElement('input');
        fileInput.type = 'text';
        fileInput.value = files[i].name;
        fileInput.classList.add('file-input');
        
        // Create trash bin button for removing the file
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '🗑️';  // Unicode character for trash bin
        removeButton.classList.add('remove-button');
        
        // Add event listener to remove the file line
        removeButton.addEventListener('click', () => {
            fileListContainer.removeChild(fileLine);
            filePaths = filePaths.filter(path => path !== filePath); // Remove the file path from the array
        });
        
        // Append the input and remove button to the file line
        fileLine.appendChild(fileInput);
        fileLine.appendChild(removeButton);
        
        // Append the file line to the container
        fileListContainer.appendChild(fileLine);
    }

    console.log('Files:', filePaths);
});

formAmostraGerar.addEventListener('click', ()=>{
        event.preventDefault(); // Prevent the form from reloading the page
    
        // Get the selected values from the dropdowns
        const projetoId = formAmostraProjeto.value;
        const materialId = formAmostraMaterial.value;
        const numeroId = formAmostraNumero.value;
    
        if(projetoId == 0 | materialId == 0 | numeroId <= 0){
            alert("Por favor preencha todos os campos apropriadamente.")
            return
        }

        // You can now send these values to the main process or perform further actions
        ipcRenderer.invoke('gerar-nova-amostra', { projetoId, materialId, numeroId}).then(response => {

            if(response.erro == 1){
                alert("Erro de conexão")
                return
            }

            if(numeroId == 1){
                newCodeArea.innerHTML = ` Código gerado com sucesso! <h2 id="new-code">${response.project}-${response.student}-${response.material}-${response.number}</h2>`
            }else if(numeroId > 1){
                console.log("ENTREI")
                newCodeArea.innerHTML = ` Código gerado com sucesso! <h2 id="new-code">${response.project}-${response.student}-${response.material}-${response.number}</h2><br>ATÉ<br><h2 id="new-code">${response.project}-${response.student}-${response.material}-${response.number}</h2>`
            }

        });

        resetarNovaAmostra()
       btnGerar.style.display = 'block'
       newCodeArea.style.display = 'block'

});

function resetarNovaAmostra(){
            formAmostraProjeto.innerHTML ='<option value="0" disabled selected>Selecione o projeto</option>'
            formAmostraMaterial.innerHTML = '<option value="0" disabled selected>Selecione o material</option>'

            formAmostraNumero.value = 0
            formAmostraProjeto.value = 0
            formAmostraMaterial.value = 0
            hideAllForms() 
}

function fetchData(command){ 
    return new Promise((resolve, reject) => {
        try{
            const data = ipcRenderer.invoke('get-root-names', command); 
            resolve(data)
        }catch(e){
            reject(e)
        }
    });
}

hideAllForms()