
function protect(req, res, next) {
  console.log(req.session.currentUser);
  
  if (!req.session.currentUser) {
    return res.redirect('/');
  }

  next();
}

module.exports = {protect};
