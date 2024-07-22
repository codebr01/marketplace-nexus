exports.index = async (req, res) => {
  let user = undefined;
  if(req.session.user) {
    if( req.session.loja ) {
      return res.redirect('/loja/dashboard');
    }
    user = req.session.user;
    return res.render('index', { user });
  }else {
    return res.render('index', { user });
  }
};