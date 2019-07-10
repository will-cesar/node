const mongoose = require("mongoose");

// Configuração do mongoose
    mongoose.Promise = global.Promise;

    mongoose.connect("mongodb://localhost/teste", {  // "/teste" é o nome do banco
        useNewUrlParser: true 
    }).then(() => { 
        console.log("MongoDB conectado");
    }).catch((err) => {
        console.log("Erro ao se conectar com o mongo: " + err);
    }) 


// Model - Usuários
    const UsuarioSchema = mongoose.Schema({

        nome: {
            type: String,
            require: true
        },
        sobrenome: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        idade: {
            type: Number,
            require: true
        },
        pais: {
            type: String
        }

    })

// Collection
    mongoose.model('usuarios', UsuarioSchema);

    const Will = mongoose.model('usuarios');

    new Will({
        nome: "Will",
        sobrenome: "Cesar",
        email: "will.ro@hotmail.com",
        idade: 22,
        pais: "Brasil"
    }).save().then(() => {
        console.log("Usuário cadastrado com sucesso!");
    }).catch((err) => {
        console.log("Erro no cadastro de usuário: " + err);
    })