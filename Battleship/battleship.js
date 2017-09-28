function battleship(size, x, y, index,p) {
  this.size = size
  this.x = x
  this.p_x = 0
  this.y = y
  this.p_y = 0
  this.i = -1
  this.j = -1
  this.dragging = false
  this.direction_up = true
  this.is_set = false
  this.index = index;
  this.p=p;

  this.is_below = function () {
    for (var i = battleships.length - 1; i >= 0; i--) {
      if (battleships[i] == this) {
        break
      }
      if (battleships[i].direction_up && battleships[i].x <= this.p.mouseX && this.p.mouseX <= battleships[i].x + square_width && battleships[i].y <= this.p.mouseY && this.p.mouseY <= battleships[i].y + square_width * battleships[i].size) {
        return true
      }
      if (battleships[i].x <= this.p.mouseX && this.p.mouseX <= battleships[i].x + battleships[i].size * square_width && battleships[i].y <= this.p.mouseY && this.p.mouseY <= battleships[i].y + square_width) {
        return true
      }
    }
    return false
  }

  this.move = function () {
    var flag = false
    var p_direction = this.direction_up
    for (var i = 0; i < battleships.length; i++) {
      if (battleships[i].dragging && battleships[i] != this)
        flag = true
    }
    if (this.direction_up) {
      if (!this.dragging && !flag && !game_started && this.p.mouseIsPressed && this.x <= this.p.mouseX && this.p.mouseX <= this.x + square_width && this.y <= this.p.mouseY && this.p.mouseY <= this.y + square_width * this.size) {
        if (!this.is_below())
          this.dragging = true
      }
    } else {
      if (!this.dragging && !flag && !game_started && this.p.mouseIsPressed && this.x <= this.p.mouseX && this.p.mouseX <= this.x + this.size * square_width && this.y <= this.p.mouseY && this.p.mouseY <= this.y + square_width) {
        if (!this.is_below())
          this.dragging = true
      }
    }
    if (this.dragging || p_direction != this.direction_up) {
      this.is_set = false
      if (this.i != -1) {
        if (p_direction) {
          this.catch_squares(this.i, this.j, this.i + this.size, this.j, 0)
          this.i = -1
        } else {
          this.catch_squares(this.i, this.j, this.i, this.j + this.size, 0)
          this.i = -1
        }
      }
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (this.direction_up) {
          this.x = this.p.mouseX - square_width / 2
          this.y = this.p.mouseY - size * square_width / 2
        } else {
          this.x = this.p.mouseX - size * square_width / 2
          this.y = this.p.mouseY - square_width / 2
        }
      } else {
        this.x = this.p.mouseX - this.p_x
        this.y = this.p.mouseY - this.p_y
      }

      if (this.p.keyIsDown(this.p.UP_ARROW) && !this.direction_up) {
        this.direction_up = true
        let t = this.y;
        this.y =  this.p.mouseY - this.p.mouseX + this.x;
        this.x =  this.p.mouseX - this.p.mouseY + t;
        this.p_y = this.p.mouseY - this.y
        this.p_x = this.p.mouseX - this.x
        return
      }
      if (this.p.keyIsDown(this.p.DOWN_ARROW) && this.direction_up) {
        this.direction_up = false
        let t = this.y;
        this.y  = this.p.mouseY - this.p.mouseX + this.x;
        this.x =  this.p.mouseX - this.p.mouseY + t;
        this.p_y = this.p.mouseY - this.y
        this.p_x = this.p.mouseX - this.x
        return
      }

    }
    if (!this.dragging && this.p.mouseX != 0 && this.p.mouseY != 0) {
      this.p_y = this.p.mouseY - this.y
      this.p_x = this.p.mouseX - this.x
    }

    if (!this.p.mouseIsPressed) {
      if (this.dragging) {
        this.allign_with_grid()
      }
      this.dragging = false
    }
  }

  this.display = function () {
    this.p.fill(219, 50, 84)
    this.p.stroke(0)
    if (this.direction_up)
      this.p.rect(this.x, this.y, square_width, this.size * square_width)
    else {
      this.p.rect(this.x, this.y, square_width * this.size, square_width)
    }
  }

  this.check_for_double = function (i1, j1, size) {
    if (this.direction_up) {
      for (var i = i1; i < i1 + size; i++) {
        if (squares[i][j1].is_catched != 0) {
          return true
        }
      }
    } else {
      for (var j = j1; j < j1 + size; j++) {
        if (squares[i1][j].is_catched != 0) {
          return true
        }
      }
    }
    return false
  }


  this.allign_with_grid = function () {
    for (var i = 0; i < squares.length; i++) {
      for (var j = 0; j < squares[i].length; j++) {
        if (squares[i][j].x - 0.5 * square_width <= this.x && this.x < squares[i][j].x + 0.5 * square_width && squares[i][j].y - 0.5 * square_width <= this.y && this.y < squares[i][j].y + 0.5 * square_width) {
          if (this.direction_up && i + this.size <= board_side) {
            if (!this.check_for_double(i, j, this.size)) {
              this.is_set = true
              this.i = i
              this.j = j
              this.x = squares[i][j].x
              this.y = squares[i][j].y
              this.catch_squares(i, j, i + this.size, j, this.index)
            }
          } else if (!this.direction_up && j + this.size <= board_side) {
            if (!this.check_for_double(i, j, this.size)) {
              this.is_set = true
              this.i = i
              this.j = j
              this.x = squares[i][j].x
              this.y = squares[i][j].y
              this.catch_squares(i, j, i, j + this.size, this.index)
            }
          }
        }
      }
    }
  }
  this.doubleclick = function () {
    if (!this.is_set && this.direction_up && this.x <= this.p.mouseX && this.p.mouseX <= this.x + square_width && this.y <= this.p.mouseY && this.p.mouseY <= this.y + square_width * this.size) {
      this.direction_up = false;
      let t = this.y;
      this.y = this.p.mouseY - this.p.mouseX + this.x;
      this.x = this.p.mouseX - this.p.mouseY + t;
    } else if (!this.is_set && !this.direction_up && this.x <= this.p.mouseX && this.p.mouseX <= this.x + this.size * square_width && this.y <= this.p.mouseY && this.p.mouseY <= this.y + square_width) {
      this.direction_up = true;
      let t = this.y;
      this.y = this.p.mouseY - this.p.mouseX + this.x;
      this.x = this.p.mouseX - this.p.mouseY + t;
    }
  }

  this.catch_squares = function (i1, j1, i2, j2, num) {
    if (i1 == i2) {
      for (var j = j1; j < j2; j++) {
        squares[i1][j].is_catched = num
      }
    } else if (j1 == j2) {
      for (var i = i1; i < i2; i++) {
        squares[i][j1].is_catched = num
      }
    }
  }

}



function square(x, y,p) {
  this.x = x
  this.y = y
  this.is_catched = 0
  this.code = 0
  this.p=p;

  this.display = function () {
    if (this.code == 0)
      this.p.fill(58, 209, 176)
    else if (this.code == 1)
      this.p.fill(11, 15, 66)
    else if (this.code == 2)
      this.p.fill(214, 10, 17)
    else if (this.code == 3)
      this.p.fill(73, 3, 6)
    else if (this.code == 4)
      this.p.fill(1, 28, 6)
    else if (this.code == 5)
      this.p.fill(31, 35, 3)
    else if (this.code == 6)
      this.p.fill(0, 22, 35)
    else if (this.code == 7)
      this.p.fill(14, 2, 25)
    this.p.stroke(0)
    this.p.rect(this.x, this.y, square_width, square_width)
  }
}

function button(x, y, width, height, text1, r, g, b,p) {
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.text = text1
  this.r = r
  this.g = g
  this.b = b
  this.p=p;

  this.is_pressed = function () {
    if (this.p.mouseIsPressed && this.x < this.p.mouseX && this.p.mouseX < this.x + this.width && this.y < this.p.mouseY && this.p.mouseY < this.y + this.height)
      return true
    else {
      return false
    }
  }

  this.display = function () {
    if (this.is_pressed()) {
      r,
      g,
      b = 63,
      81,
      55
    }
    else {
      r,
      g,
      b = this.r,
      this.g,
      this.b
    }
    this.p.fill(r, g, b)
    this.p.strokeWeight(5)
    this.p.stroke(255)
    this.p.rect(this.x, this.y, this.width, this.height)
    this.p.fill(255)
    this.p.stroke(0)
    this.p.textSize(32)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.text(this.text, this.x, this.y, this.width, this.height)
  }

}