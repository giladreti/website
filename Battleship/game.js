var board_width
var board_start_x
var board_start_y
var square_width
var squares
var enemy_squares
var choices
var battleships
var game_started = false
var finished = false
var dragging = false
var board_side = 9
var start_button
var response = -1
var finished = false;
var turn = 0
var last_attack = -1;
var win_counter;
const socket = io('/battleships');
var clicked_once = false;
var boom;
var replay_button;
var splash
var myp5;




function startSketch() {
  var sketch = function (p) {
    p.mouseClicked = function () {
      if (clicked_once) {
        for (var i = 0; i < battleships.length; i++) {
          battleships[i].doubleclick();
        }
        clicked_once = false;
      } else {
        clicked_once = true
        setTimeout(function () {
          clicked_once = false;
        }, 200)
      }
    }


    p.preload = function () {
      boom = p.loadSound('../img/battleships/Bomb.mp3');
      splash = p.loadSound('../img/battleships/Splash.mp3');
    }
    p.setup = function () {
      game_started = false
      finished = false
      dragging = false
      board_side = 9
      start_button
      response = -1
      finished = false;
      turn = 0
      last_attack = -1;
      win_counter = 1;

      board_width = 2 * wHeight / 3
      board_start_x = (wWidth - board_width) / 2
      board_start_y = (wHeight - board_width) / 3
      square_width = board_width / board_side
      squares = new Array(board_side)
      enemy_squares = new Array(board_side)
      choices = new Array(board_side)
      battleships = new Array(5)
      battleships[0] = new battleship(2, board_start_x - 2 * square_width, board_start_y - 3 * square_width / 4, 1, p), battleships[1] = new battleship(3, board_start_x - 2 * square_width, board_start_y + 1.5 * square_width, 2, p), battleships[2] = new battleship(3, board_start_x - 2 * square_width, board_start_y + 4.75 * square_width, 3, p), battleships[3] = new battleship(4, board_start_x + board_width + square_width, board_start_y - 0.5 * square_width, 4, p)
      battleships[4] = new battleship(5, board_start_x + board_width + square_width, board_start_y + 4 * square_width, 5, p)
      start_button = new button(board_start_x + board_width / 3, board_start_y + 11 * board_width / 10, 3 * square_width, square_width, ' START', 122, 244, 66, p)
      replay_button = new button(board_start_x + board_width / 3, board_start_y + 11 * board_width / 10, 3 * square_width, square_width, ' REPLAY', 122, 244, 66, p)
      p.createCanvas(wWidth, wHeight)

      for (var i = 0; i < board_side; i++) {
        squares[i] = new Array(board_side)
        for (var j = 0; j < board_side; j++) {
          squares[i][j] = new square(board_start_x + j * square_width, board_start_y + i * square_width, p)
        }
      }
      for (var i = 0; i < board_side; i++) {
        enemy_squares[i] = new Array(board_side)
        for (var j = 0; j < board_side; j++) {
          enemy_squares[i][j] = new square(board_start_x + j * square_width, board_start_y + i * square_width, p)
        }
      }
      for (var i = 0; i < board_side; i++) {
        choices[i] = new Array(board_side)
        for (var j = 0; j < board_side; j++) {
          choices[i][j] = new square(board_start_x + j * square_width, board_start_y + i * square_width, p)
        }
      }

    }

    socket.on('last_attack', function (attack) {
      last_attack = attack;
    });

    socket.on('start', function (data) {
      game_started = true;
      turn = data.turn;
      for (var i = 0; i < enemy_squares.length; i++) {
        for (var j = 0; j < enemy_squares[i].length; j++) {
          choices[i][j].is_catched = parseInt(data.board.charAt(9 * i + j));
        }
      }
    })

    socket.on('lose', function () {
      win_counter = -1;
    })


    p.draw = function () {
      p.background(0)
    if (!finished) {
        before_start(p)
      }
      if (win_counter == 0) {
        p.push()
        p.fill(103, 250, 255)
        p.textSize(48)
        p.text('YOU WON!', board_start_x, board_start_y, board_width, board_width)
        p.pop()
        replay_button.display();
        if (replay_button.is_pressed()) {
          p.remove();
          startSketch();
        }
        return
      }
      if (win_counter == -1) {
        p.push()
        p.fill(103, 250, 255)
        p.textSize(48)
        p.text('YOU LOSED!', board_start_x, board_start_y, board_width, board_width)
        p.pop()
        replay_button.display();
        if (replay_button.is_pressed()) {
          p.remove();
          startSketch();
        }
        return
      }

      if (game_started) {
        if (turn == 0) {
          your_turn(p)
        } else {
          enemy_turn(p)
        }
      } else if (finished) {
        p.push()
        p.fill(103, 250, 255)
        p.textSize(48)
        p.text('Waiting for opponent...', board_start_x, board_start_y, board_width, board_width)
        p.pop()
      }
    }
  }
  myp5 = new p5(sketch);
}