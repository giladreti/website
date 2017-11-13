before_start = function (p) {
  let temp = -1;
  start_button.display()
  if (start_button.is_pressed()) {
    var flag = true
    for (var i = 0; i < battleships.length; i++) {
      if (!battleships[i].is_set)
        flag = false
    }
    if (flag) {
      finished = true
      var string = ''
      for (var i = 0; i < squares.length; i++) {
        for (var j = 0; j < squares[i].length; j++) {
          if (squares[i][j].is_catched) {
            string += (squares[i][j].is_catched)
          } else {
            string += '0'
          }
        }
      }
      finished = true;
      socket.emit('ready', string);
      return;
    }
  }
  for (var i = 0; i < squares.length; i++) {
    for (var j = 0; j < squares[i].length; j++) {
      squares[i][j].display()
    }
  }
  for (var i = 0; i < battleships.length; i++) {
    battleships[i].move()
    if (!battleships[i].dragging)
      battleships[i].display()
    else {
      temp = i
    }
  }
  if (temp != -1) {
    battleships[temp].display()
  }
  battleships = move_back(battleships, temp)
}

your_turn = function (p) {
  p.push()
  p.textSize(32)
  p.fill(255)
  p.textAlign(p.CENTER, p.CENTER)
  p.text("Your turn", board_start_x, board_start_y + board_width, board_width, 50)
  p.pop()

  for (var i = 0; i < choices.length; i++) {
    for (var j = 0; j < choices[i].length; j++) {
      choices[i][j].display()
    }
  }
  if (p.mouseIsPressed) {
    for (var i = 0; i < choices.length; i++) {
      for (var j = 0; j < choices[i].length; j++) {
        if (choices[i][j].code == 0 && choices[i][j].x <= p.mouseX && p.mouseX <= choices[i][j].x + square_width && choices[i][j].y <= p.mouseY && p.mouseY <= choices[i][j].y + square_width) {
          if (choices[i][j].is_catched != 0) {
            choices[i][j].code = 2;
            win_counter--;
            boom.play();
            if (win_counter == 0) {
              check_for_sink(choices, i, j);
              socket.emit('win');
              return;
            }
            check_for_sink(choices, i, j);
          } else {
            choices[i][j].code = 1;
            splash.play();
          }
          for (var i1 = 0; i1 < choices.length; i1++) {
            for (var j1 = 0; j1 < choices[i1].length; j1++) {
              choices[i1][j1].display();
            }
          }
          socket.emit('attack', board_side * i + j);
          turn = 1;
          p.noLoop();
          setTimeout(function () {
            p.loop()
          }, 3000);
          return;
        }
      }
    }
  }
}

function move_back(array, index) {
  a = new Array(array.length)
  if (index == -1) {
    var j = 0
    for (var i = 0; i < array.length; i++) {
      if (array[i].is_set) {
        a[j] = array[i]
        j++
        array.splice(i, 1)
      }
    }
    for (var i = 0; i < array.length; i++) {
      a[j] = array[i]
      j++
    }
  } else if (array[index].is_set) {
    a[0] = array[index]
    for (var i = 0; i < index; i++) {
      a[i + 1] = array[i]
    }
    for (var i = index + 1; i < array.length; i++) {
      a[i] = array[i]
    }
  } else {
    a[array.length - 1] = array[index]
    for (var i = 0; i < index; i++) {
      a[i] = array[i]
    }
    for (var i = index; i < array.length - 1; i++) {
      a[i] = array[i + 1]
    }
  }
  return a
}


check_for_sink = function (choices1, i1, j1) {
  var flag = true
  var horizontal = false
  for (var i = 0; i < board_side; i++) {
    if (choices1[i1][i].is_catched == choices1[i1][j1].is_catched && i != j1) {
      horizontal = true
      if (choices1[i1][i].code != 2) {
        return
      }
    }
  }
  if (!horizontal) {
    for (var i = 0; i < board_side; i++) {
      if (choices1[i][j1].is_catched == choices1[i1][j1].is_catched && i != i1) {
        horizontal = false
        if (choices1[i][j1].code != 2) {
          return
        }
      }
    }
  }
  if (horizontal) {
    for (var i = 0; i < board_side; i++) {
      if (choices1[i1][i].is_catched == choices1[i1][j1].is_catched) {
        choices1[i1][i].code = 2 + choices1[i1][i].is_catched
      }
    }
  } else {
    for (var i = 0; i < board_side; i++) {
      if (choices1[i][j1].is_catched == choices1[i1][j1].is_catched) {
        choices1[i][j1].code = 2 + choices1[i][j1].is_catched
      }
    }
  }
}

enemy_turn = function (p) {
  p.push()
  p.textSize(32)
  p.fill(255)
  p.textAlign(p.CENTER, p.CENTER)
  p.text("Enemy's turn", board_start_x-45, board_start_y + board_width, board_width+100, 50)
  p.pop()
  for (var i = 0; i < squares.length; i++) {
    for (var j = 0; j < squares[i].length; j++) {
      squares[i][j].display()
    }
  }
  for (var i = 0; i < battleships.length; i++) {
    battleships[i].display()
  }
  for (var i = 0; i < squares.length; i++) {
    for (var j = 0; j < squares[i].length; j++) {
      if (squares[i][j].code != 0)
        squares[i][j].display()
    }
  }
  if (last_attack != -1) {
    if (squares[~~(last_attack / 9)][last_attack % 9].is_catched != 0) {
      squares[~~(last_attack / 9)][last_attack % 9].code = 2
      boom.play();
    } else {
      squares[~~(last_attack / 9)][last_attack % 9].code = 1
      splash.play()
    }
    check_for_sink(squares, ~~(last_attack / 9), last_attack % 9)
    for (var i1 = 0; i1 < squares.length; i1++) {
      for (var j1 = 0; j1 < squares[i1].length; j1++) {
        if (squares[i1][j1].code != 0) {
          squares[i1][j1].display()
        }
      }
    }
    turn = 0;
    last_attack = -1;
    p.noLoop();
    setTimeout(function () {
      p.loop()
    }, 3000)

  }
  return;
}