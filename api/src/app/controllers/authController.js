const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const authConfig = require("../../config/auth.json");
const mailer = require('../../modules/mailer');

const router = express.Router();

function generateToken(params = {}) { // gera um token
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400 // expira em 86400 segundos, um dia
    })
}

router.post('/register', async (req,res) => { // rota de registro de usuário
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

router.post('/authenticate', async (req,res) => { // rota de autenticação de usuário
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
});

router.post('/forgot_password', async (req,res) => { // rota de "esqueci minha senha" para o envio do token via email
    const { email } = req.body;

    try { 
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: "User not found" }); 
        }

        const token = crypto.randomBytes(20).toString('hex'); // gera um token aleatório de 20 caracteres string em hexadecimal
        
        const now = new Date();
        now.setHours(now.getHours() + 1); // data de expiração do token

        await User.findByIdAndUpdate(user.id, { //seta o token novo no usuário 
            '$set': { // "$set" utilizado para selecionar os campos que serão setados
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        mailer.sendMail({ // configuração de envio do email
            to: email,
            from: 'will.roc@hotmail.com',
            template: 'auth/forgot_password',
            context: { token } // context onde será passada as variáveis
        }, (err) => {
            if (err) {
                return res.status(400).send({ error: "Cannot send forgot password email", error2: err });
            }

            return res.send({ status: "Email send" });
        });

    } catch (err) {        
        res.status(400).send({ error: "Error on forgot password, try again", error2: err });
    }
});

router.post('/reset_password', async (req,res) => { // rota para resetar a senha
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user) {
            return res.status(400).send({ error: "User not found" }); 
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Token invalid!' });
        }

        const now = new Date();

        if (now > user.passwordResetExpires) {
            return res.status(400).send({ error: 'Token expired, generate a new one' });
        }

        user.password = password;

        await user.save();

        res.send({ status: "ok" });

    } catch (err) {
        res.status(400).send({ error: "Cannot reset password, try again!", error2: err });
    }
})

module.exports = (app) => app.use('/auth', router); // ele registra as rotas desse controller dentro da rota /auth, ficando /auth/algumacoisa