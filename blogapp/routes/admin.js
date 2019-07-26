const express = require('express');
const router = express.Router();
const mongoose = require("mongoose") // para utilizar um model de forma externa é preciso importar o mongoose
require("../models/Categorias") // chama o arquivo do model
const Categoria = mongoose.model("categorias") // e chama a função que passa uma refêrencia do model
require("../models/Postagens")
const Postagem = mongoose.model("postagens")

router.get('/', (req,res) => { // cria a index da página de admin
    res.render("admin/index");
})

router.get("/posts", (req, res) => {
    res.send("Página de posts");
})

router.get("/categorias", (req, res) => { // página de categorias
    Categoria.find().sort({date: 'desc'}).then((categorias) => { // lista todas as categorias
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get("/categorias/add", (req, res) => { // pagina para adicionar categoria
    res.render("admin/addcategoria")
})

router.post("/categorias/nova", (req, res) => { // método para adicionar categoria 

    let erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: "Nome inválido"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({texto: "Slug inválido"})
    }

    if (req.body.nome.length < 2) {
        erros.push({texto: "Nome da categoria pequeno"})
    }

    if (erros.length > 0) {
        res.render("admin/addcategoria", {erros: erros})
    }
    else {

        const novaCategoria= {
            nome: req.body.nome, // nome e slug fazem referência aos campos "name" no input
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })

    }    
})

router.get("/categorias/edit/:id", (req, res) => { // método para pegar os dados de uma categoria pelo id
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        req.redirect("/admin/categorias")
    })    
})

router.post("/categorias/edit", (req, res) => { // método para editar uma categoria
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            res.flash("error_msg", "Houve um erro ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao edtiar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", (req, res) => { // método para deletar uma categoria
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria" + err)
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", (req,res) => { // criando a rota de postagens

    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
})

router.get("/postagens/add", (req,res) => { // criando a página de adicionar nova postagem
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário" + err)
        req.redirect("/admin")
    })    
})

router.post("/postagens/nova", (req,res) => { // método post para adicionar no banco uma postagem
    let erros = [];

    if (req.body.categoria == "0") {
        erros.push({text: "Categoria inválida! Registre uma categoria"})
    }

    if (erros.length > 0) {
        res.render("admin/addpostagem", {erros: erros})
    }   
    else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug 
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro durante o salvamento da postagem" + err)
            res.redirect("/admin/postagens")
        })
    }
})

router.get("/postagens/edit/:id", (req,res) => { // cria a página de edição de postagem

    Postagem.findOne({_id: req.params.id}).then((postagem) => {
        Categoria.find().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})            
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias" + err)
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição" + err)
        res.redirect("/admin/postagens")
    })
})

router.post("/postagem/edit", (req,res) => { // edita as postagens

    Postagem.findOne({_id: req.body.id}).then((postagem) => { // pega a postagem pelo id que vem do parâmetro passado no botão de editar dentro do post

        postagem.titulo = req.body.titulo // substitui as informações existente pelas novas editadas, pegandos os campos pela prop "name"
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo 
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro interno" + err)
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a edição" + err)
        res.redirect("/admin/postagens")
    })

})

router.get("/postagens/deletar/:id", (req,res) => {
    Postagem.remove({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria" + err)
        res.redirect("/admin/postagens")
    })
})    

module.exports = router;