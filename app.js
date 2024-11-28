var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const dotenv = require('dotenv').config();
// const authenticate = require('./middleware/authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
mongoose.set('runValidators', true);
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open', () => {
  console.log("connect");
}).on('error', (error) => {
  console.log(error);
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const adminpaths = [
  { pathur1: '/login', routerFile: 'login' },
  { pathur2: '/register', routerFile: 'register' },
]

const productadd = [
  { pathur1: '/save', routerFile: 'save' },
  { pathur2: '/deleteproduct', routerFile: 'deleteproduct' },
  // { pathur3: '/productremove', routerFile: 'productremove' },
  // { pathur2: '/size', routerFile: 'size' },
  // { pathur2: '/tasklist', routerFile: 'tasklist' },
  // { pathur3: '/tasksdelete', routerFile: 'tasksdelete' },
]

const sizeproduct = [
  { pathur1: '/size', routerFile: 'size' },
  // { pathur2: '/tasklist', routerFile: 'tasklist' },
  // { pathur3: '/tasksdelete', routerFile: 'tasksdelete' },
]

adminpaths.forEach((path) => {
  app.use('/admin' + path.pathur1, require('./routes/admin/' + path.routerFile));
  app.use('/admin' + path.pathur2, require('./routes/admin/' + path.routerFile));
});

productadd.forEach((path) => {
  app.use('/mainadmin' + path.pathur1, require('./routes/mainadmin/' + path.routerFile));
  app.use('/mainadmin' + path.pathur2, require('./routes/mainadmin/' + path.routerFile));
  // app.use('/mainadmin' + path.pathur3, require('./routes/mainadmin/' + path.routerFile));
  // app.use('/task' + path.pathur2, require('./routes/task/' + path.routerFile));
  // app.use('/task' + path.pathur3, require('./routes/task/' + path.routerFile));
});


sizeproduct.forEach((path) => {
  app.use('/master' + path.pathur1, require('./routes/master/' + path.routerFile));

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




