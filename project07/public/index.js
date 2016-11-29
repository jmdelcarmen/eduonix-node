'use strict';

$(function () {
  var socket = io.connect();
  var $messageForm = $('#messageForm');
  var $message = $('#message');
  var $chat = $('#chatWindow');
  var $usernameForm = $('#usernameForm');
  var $users = $('#users');
  var $username = $('#username');
  var $error = $('#error');

  $messageForm.submit((e) => {
    e.preventDefault();
    socket.emit('send message', $message.val());
    $message.val('');
    $("#chatWindow").animate({ scrollTop: 10000000});
  });



  $usernameForm.submit((e) => {
    e.preventDefault();
    socket.emit('new user', $username.val(), (data) => {
      if (data) {
        $('#namesWrapper').hide();
        $('#mainWrapper').show();
      } else {
        $error.html('Username is taken');
      }
    });
  });

  socket.on('usernames', (usernames) => {
    var users = '';
    for (var i = 0; i < usernames.length; i++) {
      users += usernames[i] + '<br>';
    }
    $users.html(users);
  });

  socket.on('new message', (data) => {
    if (data) {
      $chat.append('<p>' + '<strong>' + data.user + '</strong>: ' +  data.msg + '<br>');
    }
  });

  socket.on('usernames', (usernames) => {

  });

});
