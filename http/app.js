let http = require('http'); //módulo padrão já existente no node

http.createServer(function(req, res){
    res.end("Ola"); //enviará uma mensagem
}).listen(8080);

console.log("Servidor criado");