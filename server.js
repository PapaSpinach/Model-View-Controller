require('dotenv').config();
const express = require('express')
const { engine } = require('express-handlebars');
const path = require('path');
const sequelize = require('./db');
const authRoutes = require('./controllers/auth');
const session = require('express-session');
const postRoutes = require('./controllers/posts');

const app = express();

app.use(session({secret: 'asdflkjasdf',  resave: false,
  saveUninitialized: true}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
  res.render('home', { currentUser: req.session.currentUser });
});

app.use(authRoutes);
app.use('/posts', postRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  });
})
