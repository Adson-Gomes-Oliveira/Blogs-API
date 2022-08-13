const express = require('express');
const routes = require('./routes');
const authorization = require('./middlewares/authMiddleware');
const error = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use('/login', routes.SignIn);
app.use('/user', routes.User);
app.use('/categories', authorization, routes.Category);
app.use('/post', authorization, routes.BlogPost);
app.use(error);

module.exports = app;
