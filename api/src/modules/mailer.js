// configuração do email

const path = require('path');
const nodemailer = require('nodemailer'); // npm i --save nodemailer
const hbs = require('nodemailer-express-handlebars'); // npm i --save nodemailer-express-handlebars

const { host, port, user, pass } = require('../config/mail.json'); // dessa forma cada variável já virá com os dados de cada propriedade do objeto

const transport = nodemailer.createTransport({ // esse trecho de código é tirado do mailtrap, onde é a caixa de email que serão enviado os emails
    host,
    port,
    auth: { user, pass }
});

// == o objeto acima é o mesmo do abaixo, mas em formato ECS 6
//
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "da3b012d64398e",
//         pass: "98027b3dcca614"
//     }
//

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: './resources/mail/auth',
    layoutsDir: './resources/mail/auth',
    defaultLayout: 'forgot_password.html',
  },
  viewPath: path.resolve('./resources/mail'),
  extName: '.html',
};
  
transport.use('compile', hbs(handlebarOptions));

module.exports = transport;