const express = require('express');
const router = express.Router();
//db
const db = require('monk')(process.env.MONGO_DB_URI);
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

router.post('/addcomment', (req, res, next) => {
  console.log('hi');
  let name = req.body.name;
  let email = req.body.email;
  let body = req.body.body;
  let postid = req.body.postid;
  let commentdate = new Date();

  req.checkBody('name', 'Name filed is required').notEmpty();
  req.checkBody('email', 'Email filed is required but never displyed').notEmpty();
  req.checkBody('email', 'Email is not formatted properly').isEmail();
  req.checkBody('body', 'Body filed is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    var posts = db.get('posts');
    posts.findById(postid, (e, post) => {
      res.render('post', {
        "errors": errors,
        "post": post
      });
    });
  }
  else {
    var comment = {
      "name": name,
      "email": email,
      "body": body,
      "commentdate": commentdate
    };

    var posts = db.get('posts');
    posts.update({_id: postid}, {$push:{"comments": comment}}, (e, post) => {
      if (e) {
        throw e;
      }
      else {
          req.flash('success', 'Comment Added');
          res.redirect('/posts/show/' +postid);
      }

    });
  }

});






module.exports = router;
