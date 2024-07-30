const Produto = require('../models/ProdutoModel');

exports.index = async (req, res) => {
  let user = undefined;
  const produtos =  await new Produto().getAllProdutos();
  if(req.session.user) {
    if( req.session.loja ) {
      return res.redirect('/loja/dashboard');
    }
    user = req.session.user;
    return res.render('index', { user, produtos });
  }else {
    return res.render('index', { user, produtos });
  }
};