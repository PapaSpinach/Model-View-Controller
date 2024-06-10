const express = require('express');
const bcrypt = require('bcrypt');
const authRoutes = express.Router();
const { User } = require('../models');

authRoutes.get('/signup', (req, res) => {
  res.render('signup', {currentUser: req.session.currentUser});
});

authRoutes.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({username, password: hashedPassword});

  res.redirect('/');
});

authRoutes.get('/login', (req, res) => {
  res.render('login', {currentUser: req.session.currentUser});
});

authRoutes.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({where: {username}});

  if (!user) {
    return res.status(404).send('User not found');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(404).send('Invalid password');
  }

  req.session.regenerate(err => {
    if (err) return next(err);

    req.session.currentUser = { username, id: user.id };

    req.session.save(function (err) {
      if (err) return next(err)
        res.redirect('/');
    })
  });
});

authRoutes.get('/logout', function (req, res, next) {
  req.session.currentUser = null

  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
})

module.exports = authRoutes;
