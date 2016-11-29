'use strict';

const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server),
      usernames = [];

server.listen(process.env.PORT || 3000);
console.log('Awesome ChatIO at port 3000 . . . ');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});


//Sockets
io.sockets.on('connection', (socket) => {
  console.log('Socket connected');


  socket.on('new user', (data, callback) => {
    if (usernames.indexOf(data) !== -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  //update usernames
  function updateUsernames () {
    io.sockets.emit('usernames', usernames);
  }

  //send a message
  socket.on('send message', (data) => {
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  socket.on('disconnect', (data) => {
    if (!socket.username) {
      return;
    }
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });

});
