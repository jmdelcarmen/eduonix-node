'use strict';

exports.displayIndex = (req, res) => {
  res.render('index');
}

exports.displayDoctors = (req, res) => {
  res.render('doctors');
}


exports.displayAddDoctors = (req, res) => {
  res.render('doctors');
}
