const sincro = require('./backend/sincro')
const auth = require('./backend/autenticacao')

auth().then(sincro.pegarBanco).catch(console.error);
