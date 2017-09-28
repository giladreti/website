var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var Users = [];
var waiting = false;
var games = [];
const battleship_socket = io.of('/battleships');
const chat_socket = io.of('/chat');


function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

var getUsernames = function () {
  let temp = [];
  for (var i = 0; i < Users.length; i++) {
    temp.push(Users[i].username);
  }
  return temp;
}

var finduser = function (username) {
  for (var i = 0; i < Users.length; i++) {
    if (Users[i].username == username) {
      return i;
    }
  }
  return -1
}

var findIndex = function (array, socket) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].socket == socket) {
      return i;
    }
  }
  return -1
}

var findGame = function (socket) {
  for (var i = 0; i < games.length; i++) {
    if (games[i].player1.socket == socket || games[i].player2.socket == socket) {
      return i;
    }
  }
  return -1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../favicon.ico'));
});

app.get('/style.css', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../style.css'));
});

app.use('/pacman', express.static(__dirname+'/../pacman'));

app.use('/img', express.static(__dirname + '/../img'));

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

var getUsernames = function () {
  let temp = [];
  for (var i = 0; i < Users.length; i++) {
    temp.push(Users[i].username);
  }
  return temp;
}

var finduser = function (username) {
  for (var i = 0; i < Users.length; i++) {
    if (Users[i].username == username) {
      return i;
    }
  }
  return -1
}

var findIndex = function (array, socket) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].socket == socket) {
      return i;
    }
  }
  return -1
}

var findGame = function (socket) {
  for (var i = 0; i < games.length; i++) {
    if(i===games.length-1 && waiting){
      break;
    }
    else if (games[i].player1.socket == socket || games[i].player2.socket == socket) {
      return i;
    }
  }
  return -1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../favicon.ico'));
});

app.get('/style.css', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../style.css'));
});

app.use('/pacman', express.static(__dirname+'/../pacman'));

app.use('/img', express.static(__dirname + '/../img'));

app.use('/messenger', express.static(__dirname + '/../messenger'));

app.use('/battleship', express.static(__dirname + '/../Battleship'))

http.listen(port, function () {
  console.log('listening on *:' + port);
});


// SOCKET.IO

battleship_socket.on('connection', function (socket) {
  socket.on('win', function () {
    for (var i = 0; i < games.length; i++) {
      if (games[i].player1.socket == socket) {
        games[i].player2.socket.emit('lose');
        games.splice(i, 1)
        return;
      }
      if (games[i].player2.socket == socket) {
        games[i].player1.socket.emit('lose');
        games.splice(i, 1)
        return;
      }
    }
  })

  socket.on('ready', function (board) {
    if (waiting) {
      games[games.length - 1].player2 = {
        socket: socket,
        board: board
      }
      games[games.length - 1].player1.socket.emit('start', {
        turn: 0,
        board: board
      })
      socket.emit('start', {
        turn: 1,
        board: games[games.length - 1].player1.board
      });
      waiting = false;
    } else {
      games.push({
        player1: {
          socket: socket,
          board: board
        }
      });
      waiting = true;
    }
  });

  socket.on('attack', function (attack) {
    for (var i = 0; i < games.length; i++) {
      if (games[i].player1.socket == socket) {
        games[i].player2.socket.emit('last_attack', attack);
        return;
      }
      if (games[i].player2.socket == socket) {
        games[i].player1.socket.emit('last_attack', attack);
        return;
      }
    }
  });

  socket.on('disconnect', function () {
    let game_index = findGame(socket)
    if (game_index != -1) {
      if (findGame(socket) == games.length - 1 && waiting) {
        waiting = false
      }
      games.splice(game_index, 1)
    }
  })

});

chat_socket.on('connection', function (socket) {

  socket.on('login', function (username) {
    if (finduser(username) > -1) {
      socket.emit('usernameErr');
      return;
    }
    console.log('user connected')
    socket.emit('usernameOk');
    socket.emit('welcome', getUsernames());
    let color = '#'
    for (var i = 0; i < 6; i++) {
      color += getRandomInt(0, 15).toString(16);
    }
    chat_socket.to('connected').emit('user connected', {
      user: username,
      color: color
    });
    socket.join('connected');
    Users.push({
      socket: socket,
      username: username,
      color: color
    });
  });

  socket.on('chat message', function (msg) {
    console.log('New message recieved');
    socket.emit('ok', msg.id);
    let d = new Date();
    let time = addZero(d.getHours()) + ':' + addZero(d.getMinutes());
    let user = Users[findIndex(Users, socket)];
    socket.broadcast.to('connected').emit('chat message', {
      msg: msg.msg,
      user: user.username,
      color: user.color,
      time: time
    });
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    let chat_index = findIndex(Users,socket);
    if (chat_index != -1) {
      chat_socket.to('connected').emit('user disconnected', {
        user: Users[chat_index].username,
        color: Users[chat_index].color
      });
      Users.splice(chat_index, 1);
    }
  });

});