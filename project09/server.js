'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const upload = multer({dest: './public/images/portfolio'});

//routes
const index = require('./routes/index');
const admin = require('./routes/admin');

//app
const app = express();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//handle sessions
app.use(session({
  secret: 'supersecret',
  saveUninitialized: true,
  resave: true
}));

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

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(flash());

app.get('/', index.displayHomepage);

app.listen(3000, () => {
  console.log('Construction ongoing on port 3000.');
})
