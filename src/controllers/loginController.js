const Login = require('../models/LoginModel');
const Produtor = require('../models/ProdutorModel');

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

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function () {
      return res.render('output');
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
    req.session.save(function () {
      return res.render('output');
    });
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
        return res.redirect('/login');
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function () {
      return res.redirect('/login');
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
        return res.redirect('/login');
      });
      return;
    }

    req.flash('success', 'Login realizado com sucesso.');
    req.session.user = login.user;
    req.session.save(function () {
      return res.render('output');
    });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};

exports.logout = async function (req, res) {
  req.session.destroy();
  res.redirect('/home');
};