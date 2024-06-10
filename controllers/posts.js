const express = require('express');
const { Post } = require('../models');
const { protect } = require('../middleware');
const postRoutes = express.Router();

postRoutes.get('/', async (req, res) => {
  const posts = await Post.findAll();

  res.render('posts', { posts: posts.map(post => post.toJSON()), currentUser: req.session.currentUser });
});

postRoutes.get('/new', protect, async (req, res) => {
  res.render('new-post');
});

postRoutes.post('/new', protect, async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.create({
    title, content, userId: req.session.currentUser.id
  });

  res.redirect(`/posts/${post.id}`);
});

postRoutes.get('/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  res.render('post', { post: post.toJSON(), currentUser: req.session.currentUser });
});

module.exports = postRoutes;
