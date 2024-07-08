const Loja = require('../models/LojaModel');

exports.cadastroLoja = async (req, res) => {
  res.render('cadastro-loja-inicial');
};

exports.cadastrarLoja = async (req, res) => {
  res.render('cadastrar-loja');
};

exports.loja = (req, res) => {
  console.log(req.body);
  res.render('404');
};

exports.enviarCadastro = async (req, res) => {
  try{

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
    
    return res.json(loja);

  }catch(e) {
    console.log(e);
    return res.render('404');
  }
};