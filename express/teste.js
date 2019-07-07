const Sequelize = require('sequelize')
const sequelize = new Sequelize('teste', 'root', 'will0104', {
    host: "localhost",
    dialect: 'mysql'    
})

const Postagem = sequelize.define('postagens', {
    titulo: {
        type: Sequelize.STRING
    },
    conteudo: {
        type: Sequelize.TEXT
    }
})

// Postagem.create({
//     titulo: "Um titulo",
//     conteudo: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem"
// })

const Usuarios = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING
    },
    sobrenome: {
        type: Sequelize.STRING
    },
    idade: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    }
})

// Usuarios.create({
//     nome: 'Will',
//     sobrenome: 'Cesar',
//     idade: 22,
//     email: 'will.roc@hotmail.com'
// })

// Usuarios.sync({force: true})

sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso");
}).catch(function(erro){
    console.log("Falha ao se conectar: "+erro);
})