'use strict';

const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
// routes
const index = require('./routes/index');
const categories = require('./routes/categories');

const app = express();

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1']});
//create a global var for categories
const query =  "SELECT * FROM findadoc.categories";
client.execute(query, [], function (err, data) {
  if (err) {
    res.status(404).send({msg: err});
  } else {
    app.locals.cats = data.rows;
  }
});


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));





app.get('/', index.displayIndex);
app.get('/doctors', index.displayDoctors);
app.get('/doctors/add', index.displayAddDoctors);
app.post('/doctors/add', index.addDoctor);
app.get('/doctors/details/:id', index.displayDoctorDetails);
app.get('/doctors/category/:name', index.displayDoctorsByCategory)


app.get('/categories/add', categories.displayAddCategory);


console.log('Server running on port 3000...');
app.listen(3000);
