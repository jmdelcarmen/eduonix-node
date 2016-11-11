const express = require('express');
const router = express.Router();
//db
const db = require('monk')('localhost/nodeblog');
//file upload
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});

router.get('/show/:id', (req, res) => {
  var posts = db.get('posts');
  posts.findById(req.params.id, (e, post) => {
    res.render('post', {
      post: post
    });
  });
});

router.route("/add")
  .get((req, res) => {
    var categories = db.get('categories');
    categories.find({}, {}, (e, categories) => {
      if(e) throw e;
      res.render('addpost', {
        title: 'Add Post',
        categories: categories
      });
    });
  })
  .post((req, res) => {
    //Get form values
    let title = req.body.title;
    let category = req.body.category;
    let body = req.body.body;
    let author = req.body.author;
    let date = new Date();

    if (req.file) {
      var mainimage = "uploads/" + req.file.filename;
    } else {
      var mainimage = 'noimage.jpg';
    }

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.render('addpost', {
        "errors": errors
      });
    }
    else {
      var posts = db.get('posts');
      posts.insert({
        "title": title,
        "body": body,
        "category": category,
        "date": date,
        "author": author,
        "mainimage": mainimage
      }, (e, post) => {
        if(e) {
          res.send(e);
        } else {
          req.flash('success', 'Post Added');
          res.redirect('/');
        }
      });
    }
    // console.log(req.body);
    // console.log(req.file);
  });





module.exports = router;
