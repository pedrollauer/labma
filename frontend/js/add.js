// Array to store file paths
let filePaths = [];

// Get references to the select element and the drop area
const categorySelect = document.getElementById('category-select');
const fileDropArea = document.getElementById('file-drop-area');
const fileListContainer = document.getElementById('file-list');
// Get references to the form divs
const formAmostra = document.getElementById('form-amostra');
const formAtuaAmostra = document.getElementById('form-atua-amostra');
const formDocumento = document.getElementById('form-documento');

// Function to hide all forms
function hideAllForms() {
    formAmostra.style.display = 'none';
    formAtuaAmostra.style.display = 'none';
    formDocumento.style.display = 'none';
}

hideAllForms()
// Show the drop area when an option is selected
categorySelect.addEventListener('change', () => {
    fileDropArea.style.display = 'block';

    const selectedValue = parseInt(categorySelect.value, 10);

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
