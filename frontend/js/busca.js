const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
  const arquivos = await ipcRenderer.invoke('get-all-arquivos');
  console.log(arquivos)
  populateTable(arquivos);
});

function populateTable(arquivos) {
    const tableBody = document.querySelector('#arquivos-table tbody');
    arquivos.forEach((arquivo) => {
      const row = document.createElement('tr');
      
      // Create the table cells
      const nomeArquivoCell = document.createElement('td');
      nomeArquivoCell.textContent = arquivo.nome_arquivo;
  
      const codArquivoCell = document.createElement('td');
      codArquivoCell.textContent = arquivo.cod_arquivo;
  
      const usuarioCell = document.createElement('td');
      usuarioCell.textContent = arquivo.usuario;
  
      const dataCell = document.createElement('td');
      
      // Convert Firestore timestamp (seconds and nanoseconds) to JavaScript Date
      const dataSeconds = arquivo.data.seconds;
      const dataNanoseconds = arquivo.data.nanoseconds;
      const milliseconds = dataSeconds * 1000 + dataNanoseconds / 1000000;
      const date = new Date(milliseconds);
      
      dataCell.textContent = date.toLocaleString();
  
      const codAmostraCell = document.createElement('td');
      codAmostraCell.textContent = arquivo.cod_amostra;
  
      const tipoCell = document.createElement('td');
      tipoCell.textContent = arquivo.tipo;
  
      const ensaioCell = document.createElement('td');
      ensaioCell.textContent = arquivo.ensaio;
  
      // Append the cells to the row in the desired order
      row.appendChild(nomeArquivoCell); // "nome_arquivo" first
      row.appendChild(codArquivoCell);
      row.appendChild(usuarioCell);
      row.appendChild(dataCell);
      row.appendChild(codAmostraCell);
      row.appendChild(tipoCell);
      row.appendChild(ensaioCell);
  
      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }
  