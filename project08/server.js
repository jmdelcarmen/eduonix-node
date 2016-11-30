'use strict';
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
// routes
const index = require('./routes/index');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', index.displayIndex);
app.get('/doctors', index.displayDoctors);
app.get('/doctors/add', index.displayAddDoctors);


console.log('Server running on port 3000...');
app.listen(3000);
