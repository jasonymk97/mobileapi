// use dotenv
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {verifyToken} = require('./middleware/jwtFilter');

// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./docs/openapi.json");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth'); 
const transactionsRouter = require('./routes/transaction');

// configuration for database
const db = require('./config/db');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Define public paths that do not require authentication
const publicPaths = ['/auth', '/docs'];

// Apply JWT verification middleware globally, except for public paths
app.use((req, res, next) => {
  for (const path of publicPaths) {
    if (req.path.startsWith(path)) {
      return next(); // Skip token verification for paths starting with public paths
    }
  }
  verifyToken(req, res, next);
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
