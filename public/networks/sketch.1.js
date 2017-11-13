var N = 0;
var Nodes = [],
  Edges = [];
var m = 1;
const k = 0.2;
var prevh, prevw;
var mSlider, nSlider;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight - 10);
  prevh = canvas.height;
  prevw = canvas.width;
  nSlider = createSlider(0, 500, N, 1);
  nSlider.size(canvas.width / 3);
  nSlider.position(50, canvas.height - 50);
  mSlider = createSlider(1, 6, m, 1);
  mSlider.size(canvas.width / 3);
  mSlider.position(canvas.width - mSlider.width - 50, canvas.height - 50);
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
    let pN = N;
    for (let index = 0; index < nSlider.value() - pN; index++) {
      addNode(Nodes, Edges);
    }
  }
  if (N > nSlider.value()) {
    let pN = N;
    for (let index = 0; index < pN - nSlider.value(); index++) {
      Edges = removeNode(Nodes, Edges);
    }
  }
  if (m != mSlider.value()) {
    m = mSlider.value();
    Nodes = [], Edges = [];
    nSlider.value(0);
    N = 0;
  }
  text("N: " + N, nSlider.x, nSlider.y + 2 * nSlider.height);
  text("m: " + m, mSlider.x, nSlider.y + 2 * mSlider.height);
}

function addNode(Nodes, Edges) {
  node = new Node(randomGaussian(canvas.width / 2, canvas.width / 7), randomGaussian(canvas.height / 2.5, canvas.height / 8));
  N += 1;
  while(node.size!=m){
    let connected = false
    ,sum = 0, random = Math.random()*(2*N-1)*m;
    for(i in Nodes){
      v2 = Nodes[i];
      if (random <= sum) {
        Edges.push(new Edge(node, v2));
        node.size += 1;
        v2.size += 1;
        connected = true;
        break;
      }
      sum += v2.size;
    }
    if(!connected){
      Edges.push(new Edge(node, node));
      node.size += 1;
    }
  }
  node.x += Math.random() * 10;
  node.y += Math.random() * 10;
  Nodes.push(node)
}

function removeNode(Nodes, Edges) {
  node = Nodes.pop()
  newArray = Edges.filter(edge => {
    if (edge.v1 === node || edge.v2 === node) {
      edge.v1.size--;
      edge.v2.size--;
      return false
    }
    return true
  })
  N--;
  return newArray
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
  mSlider.size(canvas.width / 3);
  mSlider.position(canvas.width - mSlider.width - 50, canvas.height - 50);
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
      if(this.size > log(N)*m)
        fill(200, 200, 50, this.size * 50 / m / log(N) + 100)
      else
        fill(75, 75, 75, this.size * 100 / m / log(N) + 80)
    ellipse(this.x, this.y, this.size * 10 / m / log(N) )
    pop()
  }

  overEvent() {
    let disX = this.x - mouseX;
    let disY = this.y - mouseY;
    var dis = createVector(disX, disY);
    if (dis.mag() < this.size * 10 / m / log(N) / 2) {
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
    push()
    stroke(0, 0, 0, 60 / sqrt(m))
    line(this.v1.x, this.v1.y, this.v2.x, this.v2.y)
    pop()
  }
}