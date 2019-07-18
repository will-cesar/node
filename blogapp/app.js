// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const app = express();
    const admin = require("./routes/admin");
    const path = require("path");

// Configurações

    // Body Parse
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    // Mongoose

    // Public
    app.use(express.static(path.join(__dirname, "public"))); //utilizando pastas de arquivos estáticos

// Rotas
    app.get('/', (req, res) => {
        res.send("Rota principal");
    })

    app.get('/posts', (req, res) => {
        res.send("Lista Posts");
    })

    app.use('/admin', admin); // arquivo para rotas admin

// Outros
    const PORT = 8081;
    app.listen(PORT, () => {
        console.log("Servidor rodando http://localhost:8081");
    })