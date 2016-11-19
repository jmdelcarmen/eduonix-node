'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function (router) {

  router.get('/', function (req, res) {
    res.render('manage/index');
  });

  router.get('/books', function (req, res) {
    Book.find({}, function (err, books) {
      if (err) {
        console.log(err);
      }
      res.render('manage/books/index', {
        books: books
      });
    });
  });

  router.get('/books/add', function (req, res) {
    Category.find({}, function (err, categories) {
      if (err) {
        console.log(err);
      }
      res.render('manage/books/add', {categories: categories});
    });
  });

  router.post('/books', function (req, res) {
    if (isNaN(req.body.price)) {
      req.flash('error', 'Price must be a number.');
      res.redirect('/manage/books/add');
    }

    var newBook = new Book({
      title: req.body.title.trim(),
      category: req.body.category.trim(),
      description: req.body.description.trim(),
      author: req.body.author.trim(),
      publisher: req.body.publisher.trim(),
      cover: req.body.cover.trim(),
      price: req.body.price.trim()
    });

    newBook.save(function (err) {
      if (err) {
        console.log(err);
      }
      req.flash('success', "Book Added");
    });
      res.redirect('/manage/books');
  });


  router.get('/categories', function (req, res) {
    res.render('manage/categories/index');
  });

}
