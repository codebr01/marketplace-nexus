require('dotenv').config();


const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
  app.emit('pronto');
}).catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middlewares');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, 'frontend')));
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: '!@#$%',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

// Meus Middlewares
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
  app.listen(3200, () => {
    console.log('Servidor Online');
    console.log('Acessar na porta http://localhost:3200');
  });
});
