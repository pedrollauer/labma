// Importar o módulo sqlite3
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Projects = require("../classes/projects");
const Materias = require("../classes/materiais");
const Codigos = require("../classes/codigos");
const Amostras = require("../classes/amostras");
const { Timestamp } = require("firebase/firestore");
// Caminho para o banco de dados
const dbPath = path.join(__dirname, '..', 'db', 'labma.db');

// Função para obter os nomes da tabela root
function getRootNames(command) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);

        const query = command.query
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });

        db.close();
    });
}

function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);

        // Use `db.all` for SELECT queries
        if (query.trim().toUpperCase().startsWith('SELECT')) {
            db.all(query, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        } else {
            // Use `db.run` for UPDATE/INSERT/DELETE queries
            db.run(query, params, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes }); // Resolve with metadata
            });
        }

        db.close(); // Close the database after the operation
    });
}

async function fgerarCodAmostra(data){
        let codigo;
        let codMaterial;
        let codProj;
        console.log(data)
        novo_codigo = parseInt(data.numeroId)
        executeQuery('Update codigos set codigo = codigo + ? WHERE id = 0', [novo_codigo])
    .then(rows => {
        // Return a new query based on the analysis
        console.log("ALTEACAO")
        console.log(rows)
        return executeQuery('SELECT codigo FROM codigos WHERE id= 0', []);
    })
    .then(moreRows => {
        console.log('Second query results:', moreRows);
        // Continue with further queries or processing
        console.log("Yo!")
        console.log(data)
        codigo = moreRows[0].codigo
        return executeQuery('SELECT id_cod FROM materiais where id = ?', [data.materialId]);
    })
    .then(moreRows => {
        console.log('Second query results:', moreRows);
        // Continue with further queries or processing
        console.log("Yo!")
        console.log(data)
        codMaterial = moreRows[0].id_cod
        return executeQuery('SELECT * FROM projetos where id = ?', [data.projetoId]);
    })
    .then(finalRows => {
        console.log('Third query results:', finalRows);
        codProj = finalRows[0].id_cod
        codFormatado = ('000' + codigo).substr(-3)
        console.log(codProj+"-"+"PL"+"-"+codMaterial+"-"+codFormatado)
        resolve({erro: 0, project: codProj,student: "PL",number: codFormatado, material: codMaterial})
        // Final processing
    })
    .catch(err => {
        console.error('Error occurred during the query chain:', err);
        // Handle errors here
    });

}
async function gerarNomeArquivo(codigoBase){
  
    //Vemos se já tem algum registro
    const codigos = new Codigos()
    let registros = await codigos.getCodigosByTabela(codigoBase)
  
    if(registros.length==0){
      codigos.createCodigo({codigo:0, tabela: codigoBase})
      registros = await codigos.getCodigosByTabela(codigoBase)
    }
  
    registros[0].codigo += 1
    console.log(registros[0])
    codigos.updateCodigo(registros[0])
  
    const codigoNovo = codigoBase + '-' + formatToThreeDigits(registros[0].codigo)
  
    return codigoNovo
  }
async function gerarCodAmostra(data, user){
    console.log('All set')
    const projetos = new Projects()
    const materiais = new Materias()
  
    console.log(data)
    const projeto = await projetos.getProjectById(data.projetoId)
    const material = await materiais.getMaterialById(data.materialId)
  
    const initials = getInitials(user.nome)
    const codigoBase = projeto.id_cod + '-' + initials + '-' + material.id_cod
  
    //Vemos se já tem algum registro
    const codigos = new Codigos()
    let registros = await codigos.getCodigosByTabela(codigoBase)
  
    if(registros.length==0){
      codigos.createCodigo({codigo:0, tabela: codigoBase})
      registros = await codigos.getCodigosByTabela(codigoBase)
    }
  
    registros[0].codigo += 1
    console.log(registros[0])
    codigos.updateCodigo(registros[0])
  
    const codigoNovo = codigoBase + '-' + formatToThreeDigits(registros[0].codigo)
    console.log(codigoNovo)
  
    const sample = {nome: codigoNovo, usuario: user.id, data: Timestamp.now(), material: material.id, projeto: projeto.id}
    const samples = new Amostras()
    samples.createSample(sample)
  
    return codigoNovo
  }

function formatToThreeDigits(number) {
  return number.toString().padStart(3, '0');
}

function getInitials(fullName) {
  // Split the full name into an array of words
  const nameParts = fullName.trim().split(' ');

  // Get the first two initials (first letter of the first two words)
  const initials = nameParts.slice(0, 2).map(name => name.charAt(0).toUpperCase()).join('');

  return initials;
}


module.exports = {getRootNames, gerarCodAmostra, gerarNomeArquivo}


