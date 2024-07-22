const Loja = require('../models/LojaModel');
const Produto = require('../models/ProdutoModel');

exports.cadastroLoja = async (req, res) => {
  return res.render('cadastro-loja-inicial');
};

exports.cadastrarLoja = async (req, res) => {
  return res.render('cadastrar-loja');
};

exports.dashboard = async (req, res) => {

  const { user } = req.session;
  const { loja } = req.session;

  return res.render('dashboard-produtor', { user, loja } );
};

exports.loja = (req, res) => {
  return res.render('404');
};

exports.estoque = async (req, res) => {
  try{

    const { loja } = req.session;

    const produtos = await Loja.buscarProdutos(loja.id);

    return res.render('estoque-produtos', { produtos, loja });

  }catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.excluirProduto = async (req, res) => {
  try{

    const { id } = req.params;

    const produto = await Loja.excluirProduto(id);

    if(!produto) {
      req.flash('success', 'Seu produto foi deletado com sucesso.');
    }else {
      req.flash('success', 'Algo de errado aconteceu, tente excluir novamente.');
    }

    return res.redirect('/loja/estoque');

  }catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.enviarCadastro = async (req, res) => {
  try{

    const { user } = req.session;

    req.body.idProdutor = user.id;

    const novaLoja = new Loja(req.body);

    await novaLoja.register();

    if (novaLoja.errors.length > 0) {
      req.flash('errors', novaLoja.errors);
      req.session.save(function () {
        return res.redirect('/loja/cadastrar');
      });
      return;
    }

    req.flash('success', 'Sua loja foi criada com sucesso.');

    const { loja } = novaLoja;

    req.session.loja = loja;
    
    return res.redirect('/loja/dashboard');

  }catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.redirectCadastrarProduto = async (req, res) => {
  return res.render('cadastrar-produto');
};

exports.cadastrarProduto = async (req, res) => {

  try {
    const { loja } = req.session;

    req.body.idLoja = loja.id;

    const produto = new Produto(req.body);

    await produto.register();

    if (produto.errors.length > 0) {
      req.flash('errors', produto.errors);
      req.session.save(function () {
        return res.redirect('/loja/cadastrar/produto');
      });
      return;
    }

    req.flash('success', 'Seu produto foi criado com sucesso.');
    req.session.save(function () {
      return res.redirect('/loja/estoque');
    });
  
  }catch (e) {
    console.log(e);
    return res.render('404');
  }
};