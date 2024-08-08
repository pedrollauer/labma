// Importar o módulo sqlite3
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '..', 'db', 'labma.db');

// Função para obter os nomes da tabela root
function getRootNames() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);

        db.all('SELECT nome, descricao FROM root', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });

        db.close();
    });
}

module.exports = getRootNames


