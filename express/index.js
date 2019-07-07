const express = require('express');
const app = express(); // a var "app" recebe a função "express", que vem do módulo express, copiando o framework inteiro pra dentro da variável

app.get("/", function(req, res){ // criação de uma rota padrão para a aplicação
    // res.send("Seja bem vindo!"); == modo padrão de disparar uma mensagem na página
    res.sendFile(__dirname + "/html/index.html"); // __dirname (retorna o diretório raiz da aplicação )
})

app.get("/sobre", function(req, res){
    res.sendFile(__dirname + "/html/sobre.html");
})

app.get("/blog", function(req, res){
    res.send("Pagina blog"); 
})

app.get("/ola/:nome", function(req, res){ // dois pontos (:) significa a criação de um parâmetro, um dado passado pelo usuário
    // res.send(req.params); == dessa forma irá aparecer na tela um objeto com os parâmetros preenchidos
    res.send("Olá "+req.params.nome);
})

app.listen(8080, function(){
    console.log("Servidor rodando em http://localhost:8080")
}); // função para criar o servidor, sempre obrigatoriamente será a última função do arquivo

// req - responsável por receber dados de uma requisição
// res - callback da função
