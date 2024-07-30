const Login = require('../models/LoginModel');
const Produtor = require('../models/ProdutorModel');
const Loja = require('../models/LojaModel');
const Carrinho = require('../models/CarrinhoModel');
const Produto = require('../models/ProdutoModel');

exports.index = (req, res) => {
  if(req.session.user) return res.render('output');
  return res.render('index');
};

exports.redirectCliente = (req, res) => {
  return res.render('login-cliente');
};

exports.redirectProdutorLogin = (req, res) => {
  return res.render('login-produtor');
};

exports.redirectProdutorRegister = (req, res) => {
  return res.render('cadastro-produtor');
};

exports.produtorRegistrar = async function (req, res) {
  try {
    const produtor = new Produtor(req.body);

    await produtor.register();

    if (produtor.errors.length > 0) {
      req.flash('errors', produtor.errors);
      req.session.save(function () {
        return res.redirect('/produtor/register');
      });
      return;
    }

    req.session.user = produtor.user;

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    
    req.session.save(function () {
      return res.redirect('/loja/cadastro');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.produtorLogar = async function (req, res) {
  try {
    const login = new Produtor(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/produtor/login');
      });
      return;
    }

    req.flash('success', 'Login realizado com sucesso.');

    req.session.user = login.user;
    const { user } = req.session;

    const lojaExists = await Loja.buscaPorEmail(user.email);

    if(!lojaExists) {
      req.flash('success', 'Você não tem loja, cadastre para continuar.');
      req.session.save(function () {
        return res.redirect('/loja/cadastro');
      });
      return;
    }else {
      req.session.loja = lojaExists;
      req.session.save(function () {
        return res.redirect('/loja/dashboard');
      });
    }
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.register = async function (req, res) {
  try {

    const login = new Login(req.body);

    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/');
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function () {
      return res.redirect('/cliente');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/cliente');
      });
      return;
    }

    req.flash('success', 'Login realizado com sucesso.');
    req.session.user = login.user;
    const carrinho = await new Carrinho().getCarrinho(login.user.id);

    if (!carrinho) {
      req.session.carrinho = {
        idCliente: login.user.id,
        produtos: [],
        precoTotal: 0,
      };
    } else {
      let produtos = [];
      req.session.carrinho = carrinho;
      for (const produtoId of req.session.carrinho.produtos) {
        const produto = await new Produto().getProduto(produtoId);
        produtos.push(produto);
      }
      req.session.carrinho.produtos = produtos;
    }

    req.session.save(function () {
      return res.redirect('/');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};


exports.verCarrinho = async function (req, res) {
  try {

    const { user } = req.session;
    const { carrinho } = req.session;
    
    return res.render('carrinho', { user, carrinho });

  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.adicionarCarrinho = async function (req, res) {
  try {

    const { idCliente, idProduto } = req.params;

    const produto = await new Produto().getProduto(idProduto);

    req.session.carrinho.produtos.push(produto);
    
    return res.redirect('/');

  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.excluirProdutoNoCarrinho = async function (req, res) {
  try {

    const { idCliente, idProduto } = req.params;

    const index = req.session.carrinho.produtos.findIndex(produto => produto._id === idProduto);

    if (index !== -1) {
      req.session.carrinho.produtos.splice(index, 1);
    } else {
      req.flash('errors', 'Objeto não encontrado');
    }
    
    return res.redirect(`/cliente/${idCliente}/carrinho`);

  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.logout = async function (req, res) {

  const { produtos } = req.session.carrinho;
  const { user } = req.session;

  let carrinho = await new Carrinho().getCarrinho(user.id);
  
  if(!carrinho) {
    
    const novoCarrinho = new Carrinho(req.session.carrinho);
    await novoCarrinho.guardarCarrinho(novoCarrinho.carrinho);
    
  }else{
    if ( produtos.length > 0 ) {
    
      const { carrinho } = req.session;
      const { _id } = req.session.carrinho
  
      await new Carrinho().atualizarCarrinho(_id, carrinho);
    }else {
      const { idCliente } = req.session.carrinho;
      await new Carrinho().apagarCarrinho(idCliente);
    }
  }

  req.session.destroy();

  return res.redirect('/');
};