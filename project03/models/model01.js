const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//access schema prop of mongoose
const Schema = mongoose.Schema;
//create instance of mongoose schema
var userSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  profileImage: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);

//export the model/collection with the name of 'User'
module.exports = User
