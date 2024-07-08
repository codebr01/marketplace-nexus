exports.index = async (req, res) => {
  if(!req.session.user) {
    const user = undefined;
    res.render('index', { user });
  }else {
    const { user } = req.session;
    console.log(user);
    res.render('index', { user });
  }
};