const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const bosyParser = require('body-parser');
const Post = require('./models/Post.js');

// Config
    // Template Engine
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Body Parser
    app.use(bosyParser.urlencoded({extended: false}))
    app.use(bosyParser.json())   

 
// Rotas

    app.get('/', function(req, res){
        Post.findAll({order: [['id', 'DESC']]}).then(function(posts){ // renderizando (em ordem descrecente em relação ao id) todos os posts cadastrados no modulo post
            res.render('home', { // renderizando na home os posts
                posts: posts
            })
        })        
    })

    app.get('/cad', function(req, res){
        res.render('formularios')
    })

    app.post('/add', function(req,res){ // essa rota só pode ser acessada quando é utilizado o método post
        Post.create({ // cria o post no banco
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        }).then(function(){ 
            res.redirect('/') // redireciona a página caso tenha dado sucesso
        }).catch(function(erro){
            res.send("Erro: " + erro); // apresenta o erro
        })
    })

    app.get('/deletar/:id', function(req,res){
        Post.destroy({
            where: {'id': req.params.id}
        }).then(function(){
            res.send("Postagem deletada com sucesso!");
        }).catch(function(erro){
            res.send("Erro: " + erro);
        })
    })


app.listen(8080, function(){
    console.log("Servidor em http://localhost:8080");
})