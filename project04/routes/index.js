const express = require('express');
const router = express.Router();
const db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, (e, posts) => {
    if(e) throw e;

  res.render('index', { title: 'Express', posts: posts });
});

});

module.exports = router;
