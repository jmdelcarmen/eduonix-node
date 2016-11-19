'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function (router) {

  router.get('/', function (req, res) {
    res.render('manage/index');
  });

  
  ///////////////BOOK CRUD/////////////////////
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
      // req.flash('error', 'Price must be a number.');
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
      // req.flash('success', "Book Added");
    });
      res.redirect('/manage/books');
  });

  router.get('/books/edit/:id', function (req, res) {
    Category.find({}, function (err, categories) {
      Book.findOne({_id: req.params.id}, function (err, book) {
        if (err) {
          console.log(err);
        }
        res.render('manage/books/edit', {book: book, categories: categories});
      });
    });
  });

  router.post('/books/edit/:id', function (req, res) {
    if (isNaN(req.body.price)) {
      // req.flash('error', 'Price must be a number.');
      res.redirect('/manage/books/add');
    }

    Book.update({_id: req.params.id}, {
      title: req.body.title.trim(),
      category: req.body.category.trim(),
      description: req.body.description.trim(),
      author: req.body.author.trim(),
      publisher: req.body.publisher.trim(),
      cover: req.body.cover.trim(),
      price: req.body.price.trim()
    }, function (err) {
      if (err) {
        console.log(err);
      }
    });
      // req.flash('success', "Book Updated");
      res.redirect('/manage/books');
  });

  router.get('/books/delete/:id', function (req, res) {
    Book.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        console.log(err);
      }
      // req.flash('success', "Book deleted");
      res.redirect('/manage/books');
    });
  });

///////////////CATEGORY CRUD/////////////////////
  router.get('/categories', function (req, res) {
    Category.find({}, function (err, categories) {
      if (err) {
        console.log(err);
      }
      res.render('manage/categories/index', {categories: categories});
    });
  });

  router.get('/categories/add', function(req,res) {
    res.render('manage/categories/add');
  });

  router.get('/categories/delete/:id', function(req,res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/manage/categories');
    });
  });

  router.get('/categories/edit/:id', function(req,res) {
    Category.findById(req.params.id, function (err, category) {
      if (err) {
        console.log(err);
      }
      res.render('manage/categories/edit', {category: category});
    });
  });

  router.post('/categories/edit/:id', function (req, res) {
    Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/manage/categories');
    });
  })

  router.post('/categories/add', function(req,res) {
    new Category({name: req.body.name}).save(function (err) {
      if (err) {
        console.log(err);
      }
    res.redirect('/manage/categories');
    });
  });

}
