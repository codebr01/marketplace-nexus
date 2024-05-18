const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');

const { loginRequired } = require('./src/middlewares/middlewares');

//Rota da home
route.get('/',homeController.index);

// Rotas de Login
route.get('/login/index', loginController.index);
//rotas de cliente
route.get('/cliente', loginController.redirectCliente);
route.post('/cliente/register', loginController.register);
route.post('/cliente/login', loginController.login);
//rotas de produtor
route.get('/produtor/login', loginController.redirectProdutorLogin);
route.get('/produtor/register', loginController.redirectProdutorRegister);
route.post('/produtor/registrar', loginController.produtorRegistrar);
route.post('/produtor/logar', loginController.produtorLogar);

// route.get('/login/logout', loginController.logout);

module.exports = route;