// Importar o módulo sqlite3
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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
            console.log('Aloha')
            console.log(query)
            console.log(params)
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


function gerarCodAmostra(data){
    return new Promise((resolve, reject) => {
        let codigo;
        let codMaterial;
        let codProj;
        console.log(data)
        executeQuery('Update codigos set codigo = codigo + ? WHERE id = 0', [data.numeroId])
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
    });
}
module.exports = {getRootNames, gerarCodAmostra}


