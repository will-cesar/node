// com esse arquivo, todos os controllers criados serão armazenados dentro do projeto, sendo chamado pelo arquivo principal "index.js", na linha 13

const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs.readdirSync(__dirname)
      .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js"))) // filtra os arquivos que os nomes não começam com ponto e não seja o index.js
      .forEach(file => require(path.resolve(__dirname, file))(app)) // percorrer cada arquivo e dando um require de cada um deles, passando o "(app)"    
}