'use strict';

var mongoose = require('mongoose');

var db = function () {
  return {
    config: function (conf) {
      mongoose.connect('mongodb://localhost/techbooks');
      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'Failed to connect to datbase'))
      db.once('open', function () {
        console.log('Successfully connected to the database');
      })
    }
  }
}

module.exports = db();
