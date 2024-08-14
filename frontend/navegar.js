const { ipcRenderer } = require('electron');

// Função para carregar os links com ícones e adicionar eventos
async function loadRootLinks() {
    try {
        const command = fill_command()
        console.log(command)
        const data = await ipcRenderer.invoke('get-root-names', command);
        const container = document.getElementById('root-links');
        const sideDivContent = document.getElementById('side-div-content');

        container.innerHTML = ''

        console.log(data)
        data.forEach(({ nome, descricao, tipo}) => {
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

            // Tratamos o clique do mouse
            link.addEventListener('click', () => {
                if(current_dir == 0){
                    if(tipo == 0){
                        current_dir++
                        loadRootLinks()
                    }

                    // Mostrar arquivos das pastas não diferenciadas por usuários
                }
                else if(current_dir >= 1 && current_dir <2){
                     console.log("Current dir: "+current_dir)
                     current_dir++
                     loadRootLinks()
                }

            });

            // Adiciona o link ao container
            container.appendChild(link);
        });
    } catch (error) {
        console.error('Erro ao carregar os links:', error);
    }
}

let current_dir = 0;
const current_proj = 0;
const current_student = null;
const current_sub_dir = null;

function fill_command(){
    let command;
    if(current_dir == 0){
        command = {
            query: "SELECT nome, descricao, tipo FROM roots where tipo = 1 OR tipo = 0"
        }
    }
    if(current_dir == 1){
        // Procurar os Projetos
        command = {
            query: "SELECT nome, descricao FROM projetos"
        }
    }
    if(current_dir == 2){
        // Procurar os alunos
        command = {
            query: "SELECT nome, descricao FROM usuarios"
        }
    }
    if(current_dir == 3){
        // Procurar arquivos específicos
    }
    if(current_dir == 20){
        // Procurar arquivos gerais
    }
    return command
}
// Chame a função ao carregar a página
window.onload = () => {
const returnButton = document.querySelector('.return-button');

    // Add a click event listener
    returnButton.addEventListener('click', () => {
        // Navigate to main.html
        if(current_dir == 0){
            window.location.href = './main.html';
        }else{
            current_dir--
            loadRootLinks()
        }
    });
    loadRootLinks();
}