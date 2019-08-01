const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

const Project = require('../models/project');
const Task = require('../models/task');

router.use(authMiddleware);

router.get("/", async (req,res) => { // listar projetos
    try {
        const projects = await Project.find().populate(['user', 'tasks']); // com o populate, quando der o get dos projetos, o usuário que estiver relacionado a ele será apresentado com todas as informações do mesmo

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: "Error loading projects", error2: err });
    }
});

router.get('/:projectId', async (req,res) => { // listar projeto especifico
    try {
        const projects = await Project.findById(req.params.projectId).populate('user'); // com o populate, quando der o get dos projetos, o usuário que estiver relacionado a ele será apresentado com todas as informações do mesmo

        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: "Error loading projects", error2: err });
    }
});

router.post('/', async(req,res) => { // criação de projeto
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task => { // aguarda cada promisse executar para depois continuar com o save
            const projectTask = new Task({ ...task, project: project._id});

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: "Error creating new project", error2: err });
    }
});

router.put('/:projectId', async (req,res) => { // atualizar projeto especifico
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.findByIdAndUpdate(req.params.projectId, { title, description }, { new: true }); // com o new true o mongo retorna o valor atualizado

        project.tasks = [];
        await Task.remove({ project: project._id });

        await Promise.all(tasks.map(async task => { // aguarda cada promisse executar para depois continuar com o save
            const projectTask = new Task({ ...task, project: project._id});

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();
 
        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: "Error creating new project", error2: err });
    }
});

router.delete('/:projectId', async (req,res) => { // deletar projeto especifico
    try {
        await Project.findByIdAndRemove(req.params.projectId); // procura pelo id e remove o projeto

        return res.send({ status: "ok" });
    } catch (err) {
        return res.status(400).send({ error: "Error deleting projects", error2: err });
    }
});

module.exports = app => app.use('/projects', router); 