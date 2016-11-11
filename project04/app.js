'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
//passport stuff
const session = require('express-session');
const flash = require('connect-flash');
//file upload
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});
// const upload = multer({dest: 'public/uploads'});
//db stuff
const db = require('monk')('localhost/nodeblog');
//routes
const routes = require('./routes/index');
const posts = require('./routes/posts');
const categories = require('./routes/categories');

//initialize//////////////////////////////////////////////////
const app = express();////////////////////////////////////////
//initialize//////////////////////////////////////////////////

app.locals.moment = require('moment');
app.locals.truncateText = (text, length) => {
  return text.substring(0, length);
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//handle file upload
app.use(multer({dest: 'public/uploads'}).single('mainimage'));

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//connect monk
app.use((req, res, next) => {
  req.db = db;
  next();
});

//handle sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//flash messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use('/', routes);
app.use('/posts', posts);
app.use('/categories', categories);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



console.log('Wooo! Here we go!....');
module.exports = app;
