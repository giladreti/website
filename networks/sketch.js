var N = 100;
var Nodes = [],
  Edges = [];
var p = 0.01;
const k = 0.2;
var prevh, prevw;
var pSlider, nSlider;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight - 10);
  prevh = canvas.height;
  prevw = canvas.width;
  for (let index = 0; index < N; index++) {
    Nodes.push(new Node(randomGaussian(canvas.width / 2, canvas.width / 7), randomGaussian(canvas.height / 2.5, canvas.height / 8)))
  }
  Edges = GenerateEdges(Nodes);
  nSlider = createSlider(0, 300, 100, 1);
  nSlider.size(canvas.width / 3);
  nSlider.position(50, canvas.height - 50);
  pSlider = createSlider(0, 0.1, p, 0.01);
  pSlider.size(canvas.width / 3);
  pSlider.position(canvas.width - pSlider.width - 50, canvas.height - 50);
}

function draw() {
  background(255, 255, 255);
  Edges.forEach(edge => {
    edge.draw();
  });
  Nodes.forEach(node => {
    node.update();
    node.draw();
  });
  if (N < nSlider.value()) {
    for (let index = 0; index < nSlider.value() - N; index++) {
      addNode(Nodes, Edges);
    }
    N = nSlider.value();
  }
  if (N > nSlider.value()) {
    for (let index = 0; index < N - nSlider.value(); index++) {
      Edges = removeNode(Nodes, Edges);
    }
    N = nSlider.value();
  }
  if (p != pSlider.value()) {
    p = pSlider.value();
    Nodes = []
    for (let index = 0; index < N; index++) {
      Nodes.push(new Node(randomGaussian(canvas.width / 2, canvas.width / 7), randomGaussian(canvas.height / 2.5, canvas.height / 8)))
      Nodes[index].x += Math.random() * 10;
      Nodes[index].y += Math.random() * 10;
    }
    Edges = GenerateEdges(Nodes);
  }
  text("N: " + N, nSlider.x, nSlider.y + 2 * nSlider.height);
  text("p: " + p, pSlider.x, nSlider.y + 2 * pSlider.height);
}

function addNode(Nodes, Edges) {
  node = new Node(randomGaussian(canvas.width / 2, canvas.width / 7), randomGaussian(canvas.height / 2.5, canvas.height / 8));
  Nodes.forEach(v2 => {
    if (Math.random() < p) {
      Edges.push(new Edge(node, v2));
      node.size += 1;
      v2.size += 1;
    }
    if (Math.random() < p) {
      Edges.push(new Edge(node, v2));
      node.size += 1;
      v2.size += 1;
    }
  })
  node.x += Math.random() * 10;
  node.y += Math.random() * 10;
  Nodes.push(node)
}

function removeNode(Nodes, Edges) {
  node = Nodes[Nodes.length - 1]
  newArray = Edges.filter(edge => {
    if (edge.v1 === node || edge.v2 === node) {
      edge.v1.size--;
      edge.v2.size--;
      return false
    }
    return true
  })
  Nodes.splice(-1)
  return newArray
}

function GenerateEdges(Nodes) {
  edges = [];
  Nodes.forEach(v1 => {
    Nodes.forEach(v2 => {
      if (Math.random() < p && v1 != v2) {
        edges.push(new Edge(v1, v2));
        v1.size += 1;
        v2.size += 1;
      }
    })
  })
  return edges;
}

function mousePressed() {
  for (var i = 0; i < Nodes.length; i++) {
    Nodes[i].pressed();
  }
}

function mouseReleased() {
  for (var i = 0; i < Nodes.length; i++) {
    Nodes[i].released();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 10);
  nSlider.size(canvas.width / 3);
  nSlider.position(50, canvas.height - 50);
  pSlider.size(canvas.width / 3);
  pSlider.position(canvas.width - pSlider.width - 50, canvas.height - 50);
  Nodes.forEach(node => {
    node.restX *= canvas.width / prevw;
    node.restY *= canvas.height / prevh;
  })
  prevw = canvas.width;
  prevh = canvas.height;
}

class Node {
  constructor(x, y) {
    this.x = this.restX = this.px = x;
    this.y = this.restY = this.py = y;
    this.size = this.vely = this.accel = this.velx = this.movingTime = 0;
    this.over = this.move = false;
  }

  draw() {
    push()
    if (this.move)
      fill(150, 150, 150, 215)
    else
      fill(75, 75, 75, 215)
    ellipse(this.x, this.y, this.size / p / 40)
    pop()
  }

  overEvent() {
    let disX = this.x - mouseX;
    let disY = this.y - mouseY;
    var dis = createVector(disX, disY);
    if (dis.mag() < this.size / p / 40 / 2) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    this.force = -k * (this.y - this.restY); // f=-ky 
    this.accel = 4 * this.force / (this.size + 1); // Set the acceleration, f=ma == a=f/m 
    this.vely = 0.92 * (this.vely + this.accel); // Set the velocity 
    this.y = this.y + this.vely; // Updated position 

    this.force = -k * (this.x - this.restX); // f=-kx
    this.accel = 4 * this.force / (this.size + 1); // Set the acceleration, f=ma == a=f/m 
    this.velx = 0.85 * (this.velx + this.accel); // Set the velocity 
    this.x = this.x + this.velx; // Updated position 

    if (this.move) {
      setTimeout(() => {
        this.px = this.x;
        this.py = this.y;
      }, 200)
      this.y = mouseY;
      this.x = mouseX;
    }

    if (this.overEvent() || this.move) {
      this.over = true;
    } else {
      this.over = false;
    }
  }

  pressed() {
    if (this.over) {
      this.move = true;
    } else {
      this.move = false;
    }
  }

  released() {
    this.move = false;
    this.restX = (this.restX + this.x) / 2;
    this.restY = (this.restY + this.y) / 2;
  }
}

class Edge {
  constructor(v1, v2) {
    this.v1 = v1;
    this.v2 = v2;
  }
  draw() {
    stroke(0, 0, 0, 40)
    line(this.v1.x, this.v1.y, this.v2.x, this.v2.y)
  }
}