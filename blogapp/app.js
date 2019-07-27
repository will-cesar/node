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

    require("./models/Categorias")
    const Categoria = mongoose.model("categorias")

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
    app.get('/', (req, res) => { // página principal sendo populada pelos posts
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens: postagens});
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro intero" + err)
            res.redirect("/404")
        })        
    })

    app.get("/postagem/:slug", (req,res) => { // página interna de post 
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if (postagem) {
                res.render("postagem/index", {postagem: postagem})
            }
            else {
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno" + err)
            res.redirect("/")
        })
    })

    app.get("/categorias", (req,res) => { // página de listagem de categorias
        Categoria.find().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias" + err)
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req,res)  => { // criação da página onde lista todos os posts relacionados a categoria
        Categoria.findOne({slug: req.params.slug}).then((categoria) => { // busca a categoria a partir do slug
            if (categoria) {

                Postagem.find({categoria: categoria._id}).then((postagens) => { // busca os posts que tem a mesma categoria em questão
                    
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts!" + err)
                    res.redirect("/categorias") 
                })
            }   
            else {
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/categorias")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a página dessa categoria" + err)
            res.redirect("/")
        })
    })

    app.get("/404", (req,res) => { // página de 404
        res.send("Erro 404")
    })

    app.get('/posts', (req, res) => { // página de posts
        res.send("Lista Posts");
    })

    app.use('/admin', admin); // arquivo para rotas admin

// Outros
    const PORT = 8081;
    app.listen(PORT, () => {
        console.log("Servidor rodando http://localhost:8081");
    })