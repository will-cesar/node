const db = require('./db');

const Post = db.sequelize.define('postagens', { // Criando uma tabela 'postagens' e salvando na variável
    titulo: {
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.TEXT
    }
})
 
// Post.sync({force: true}) == Só será executado uma única vez, para assim criar a table uma vez apenas

module.exports = Post