'use strict';
var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function (router) {
  router.get('/', function (req, res) {
    //get cart from session
    var cart = req.session.cart;
    var displayCart = {items: [], total: 0};
    var total = 0;

    //get total
    for(var item in cart) {
      displayCart.items.push(cart[item]);
      total+= (cart[item].qty * cart[item].price);
    }

    displayCart.total = total;

    //render cart view

    res.render('cart/index', { cart: displayCart});
  });

  router.post('/:id', function (req, res) {
    req.session.cart = req.session.cart || {};
    var cart = req.session.cart;

    Book.findById(req.params.id,  function (err, book) {
      if (err) {
        console.log(err);
      }
      //if item already exists, just add 1 to qty
      if (cart[req.params.id]) {
        cart[req.params.id].qty++
      } else {
        cart[req.params.id] = {
          item: book._id,
          title: book.title,
          price: book.price,
          qty: 1
        }
      }

      res.redirect('/cart');

    });
  });


}
