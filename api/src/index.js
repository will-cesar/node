const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); // intenda quando enviar uma requisição para a api com informações em json
app.use(bodyParser.urlencoded({ extended: false})); // para entender quando passar parâmetros via url

// app.get("/", (req,res) => { // "req" = dados da requisição, ou seja, parâmetros, token, etc -- "res" = objeto q irá enviar alguma resposta para o usuário quando utilizar a rota
//     res.send('ok')
// })

require('./app/controllers/index')(app); // repassa a classe "app" para utilizar em outros arquivos, pois o app só pode ser criado em um único projeto 

app.listen(3000, () => {
    console.log("Servidor aberto em http://localhost:3000");
});