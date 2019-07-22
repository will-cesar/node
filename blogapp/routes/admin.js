const express = require('express');
const router = express.Router();
const mongoose = require("mongoose") // para utilizar um model de forma externa é preciso importar o mongoose
require("../models/Categorias") // chama o arquivo do model

const Categoria = mongoose.model("categorias") // e chama a função que passa uma refêrencia do model

router.get('/', (req,res) => {
    res.render("admin/index");
})

router.get("/posts", (req, res) => {
    res.send("Página de posts");
})

router.get("/categorias", (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get("/categorias/add", (req, res) => {
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

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

module.exports = router;