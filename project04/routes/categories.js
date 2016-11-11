const express = require('express');
const router = express.Router();
const db = require('monk')('localhost/nodeblog');


router.get('/show/:category', (req, res) => {
  var posts = db.get('posts');
  let category = req.params.category;
  posts.find({category: category}, {}, (e, posts) => {
    if (e) throw e;
    res.render('index', {
      title: category,
      posts: posts
    });
  });
});


router.route("/add")
  .get((req, res) => {
    res.render('addcategory', {
      title: 'Add Category'
    });
  })
  .post((req, res) => {

    var name = req.body.name;
    console.log(name);
    req.checkBody('name', 'Title field is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      res.render('addpost', {
        "errors": errors
      });
    }
    else {
      var categories = db.get('categories');
      categories.insert({
        name: name
      }, (e, post) => {
        if(e) {
          res.send(e);
        } else {
          req.flash('success', 'Category Added');
          res.redirect('/categories/add');
        }
      });
    }
  });


module.exports = router;
