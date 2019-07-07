const express = require("express");
const app = express();
const handlebars = require('express-handlebars');

const Sequelize = require('sequelize')

// Config
    // Template Engine
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    
    // Conexão com o banco de dados MySql
    const sequelize = new Sequelize('teste', 'root', 'will0104', {
        host: "localhost",
        dialect: 'mysql'    
    })
 
// Rotas

    app.get('/cad', function(req, res){
        res.render('formularios')
    })

    app.post('/add', function(req,res){ // essa rota só pode ser acessada quando é utilizado o método post
        res.send('Formulário recebido!');
    })


app.listen(8080, function(){
    console.log("Servidor em http://localhost:8080");
})