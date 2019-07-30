const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400 // expira em 86400 segundos, um dia
    })
}

router.post('/register', async (req,res) => {
    const { email } = req.body

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: "User already exists"});
        }

        const user = await User.create(req.body); // await = espera a execução da crianção do usuário para continuar

        user.password = undefined; // remove o password do retorno
        return res.send({ 
            user, 
            token: generateToken({ id: user.id}) 
        });
    } catch(err) {
        return res.status(400).send({ error: "Registration failed" + err});
    }
});

router.post('/authenticate', async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) { // se não existe o usuário
        return res.status(400).send({ error: "User not found" });
    }

    if (!await bcrypt.compare(password, user.password)) { // se as senhas não bate,
        return res.status(400).send({ error: "Invalid password" });
    }

    user.password = undefined;

    res.send({ 
        user, 
        token: generateToken({ id: user.id}) 
    });
})

module.exports = (app) => app.use('/auth', router); // ele registra as rotas desse controller dentro da rota /auth, ficando /auth/algumacoisa