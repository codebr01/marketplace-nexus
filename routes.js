const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const lojaController = require('./src/controllers/lojaController');

const { loginRequired } = require('./src/middlewares/middlewares');

//Rota da home
route.get('/',homeController.index);

// Rotas de Login
route.get('/login/index', loginController.index);

//rotas de cliente
route.get('/cliente', loginController.redirectCliente);
route.post('/cliente/login', loginController.login);
route.post('/cliente/register', loginController.register);
route.get('/cliente/:id/carrinho',loginController.verCarrinho);
route.get('/cliente/:idCliente/carrinho/:idProduto',loginController.adicionarCarrinho);
route.get('/cliente/:idCliente/excluir/:idProduto',loginController.excluirProdutoNoCarrinho);

//rotas de produtor
route.get('/produtor/login', loginController.redirectProdutorLogin);
route.post('/produtor/logar', loginController.produtorLogar);
route.get('/produtor/register', loginController.redirectProdutorRegister);
route.post('/produtor/registrar', loginController.produtorRegistrar);

//rotas da loja
route.get('/loja', lojaController.loja);
route.get('/loja/cadastro', lojaController.cadastroLoja);
route.get('/loja/cadastrar', lojaController.cadastrarLoja);
route.post('/loja/enviarCadastro', lojaController.enviarCadastro);
route.get('/loja/dashboard', lojaController.dashboard);
route.get('/loja/estoque', lojaController.estoque);
route.get('/loja/cadastrar/produto', lojaController.redirectCadastrarProduto);
route.post('/loja/cadastrar/produto/cadastro', lojaController.cadastrarProduto);
route.get('/loja/estoque/excluir/:id', lojaController.excluirProduto);
route.get('/loja/estoque/:id', lojaController.redirectEditarProduto);
route.post('/loja/estoque/:id/editar', lojaController.editarProduto);

// Rota de Logout
route.get('/logout', loginController.logout);

module.exports = route;