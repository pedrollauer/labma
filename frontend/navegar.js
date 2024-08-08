const { ipcRenderer } = require('electron');

// Função para carregar os links com ícones e adicionar eventos
async function loadRootLinks() {
    try {
        const data = await ipcRenderer.invoke('get-root-names');
        const container = document.getElementById('root-links');
        const sideDivContent = document.getElementById('side-div-content');

        console.log(data)
        data.forEach(({ nome, descricao }) => {
            // Cria um link
            const link = document.createElement('a');
            link.href = `#`; // Defina o href conforme necessário

            // Cria um ícone
            const icon = document.createElement('i');
            icon.className = 'fas fa-folder'; // Usa o ícone de pasta do Font Awesome
            icon.style.fontSize = '18px'; // Ajuste o tamanho do ícone conforme necessário

            // Adiciona o ícone e o texto ao link
            link.appendChild(icon);
            link.appendChild(document.createTextNode(nome));

            // Adiciona o evento mouseover ao link
            link.addEventListener('mouseover', () => {
                sideDivContent.textContent = descricao;
            });

            // Adiciona o evento mouseout ao link
            link.addEventListener('mouseout', () => {
                sideDivContent.textContent = 'Passe o mouse sobre um link para ver a descrição.';
            });

            // Adiciona o link ao container
            container.appendChild(link);
        });
    } catch (error) {
        console.error('Erro ao carregar os links:', error);
    }
}

// Chame a função ao carregar a página
window.onload = loadRootLinks;

