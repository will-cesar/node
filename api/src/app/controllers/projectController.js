const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

const Project = require('../models/project');
const Task = require('../models/task');

router.use(authMiddleware);

router.get("/", (req,res) => {
    res.send({ user: req.userId });
});

router.get('/:projectId', async (req,res) => {
    res.send({ user: req.userId });
});

router.post('/', async(req,res) => {
    res.send({ ok: true, user: req.userId });
});

router.put('/:projectId', async (req,res) => {
    res.send({ user: req.userId });
});

router.delete('/:projectId', async (req,res) => {
    res.send({ user: req.userId });
});

module.exports = app => app.use('/projects', router); 