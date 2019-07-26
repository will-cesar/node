// Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const app = express();
    const admin = require("./routes/admin");
    const path = require("path");
    const session = require("express-session")
    const flash = require("connect-flash") // modulo flash é utilizado para apagar as mensagens logo após recarregar a página
    require("./models/Postagens")
    const Postagem = mongoose.model("postagens")

// Configurações
    // Sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(flash())

    // Middleware == tudo que utiliza o app.use é um middleware
    // app.use((req, res, next) => { // middleware é uma função que fica rodando esperando acontecer alguma requisição na aplicação, quando acontecer exerce um comando desejado
    //     console.log("Oi middleware")
    //     next();
    // })

    app.use((req, res, next) => { 
        res.locals.success_msg = req.flash("success_msg") // locals torna uma variável global na aplicação
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    // Body Parse
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

    // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp", { 
        useNewUrlParser: true 
    }).then(() => {
        console.log("Conectado ao mongo")
    }).catch((error) => {
        console.log("Erro ao se conectar: " + error);
    })

    // Public
    app.use(express.static(path.join(__dirname, "public"))); //utilizando pastas de arquivos estáticos    

// Rotas
    app.get('/', (req, res) => {
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens});
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro intero" + err)
            res.redirect("/404")
        })        
    })

    app.get("/404", (req,res) => {
        res.send("Erro 404")
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