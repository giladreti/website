var N = 100;
var Nodes = [], 
Edges = [];
var p = 0.01;
const k = 0.2;
var prevh, prevw;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight - 10);
  prevh = canvas.height;
  prevw = canvas.width;
  Nodes = GenerateNodes(N);
  Edges = GenerateEdges(Nodes);
  nSlider = createSlider(0, 300, 100, 1);
  nSlider.size(canvas.width/3);
  nSlider.position(50, canvas.height - 50);
  pSlider = createSlider(0, 0.1, p, 0.01);
  pSlider.size(canvas.width/3);
  pSlider.position(canvas.width - pSlider.width - 50, canvas.height - 50);
}

function draw() {
  background(255,255,255);
  Edges.forEach(edge => {
    edge.draw();
  });
  Nodes.forEach(node => {
    node.update();
    node.draw();
  });
  if(N != nSlider.value() || p != pSlider.value()){
    N = nSlider.value();
    p = pSlider.value();
    pSlider.elt.attributes.max.nodeValue = 5/N;
    pSlider.elt.attributes.step.nodeValue = 5/N/50;
    Nodes = GenerateNodes(N);
    Edges = GenerateEdges(Nodes);
  }
  text("N: " + N, nSlider.x, nSlider.y + 2*nSlider.height);
  text("p: " + p, pSlider.x, nSlider.y + 2*pSlider.height);
}

function GenerateNodes(N){
  let nodes = []
  for (var index = 0; index < N; index++) {
    nodes.push(new Node(randomGaussian(canvas.width/2, canvas.width/7),randomGaussian(canvas.height/2.5, canvas.height/8)));
    nodes[index].x+=70*Math.random();
    nodes[index].y+=70*Math.random();
  }
  return nodes;
}

function GenerateEdges(Nodes){
  edges = [];
  Nodes.forEach(v1 => {
    let size = 0;
    Nodes.forEach(v2 => {
      if(Math.random() < p && v1 != v2){
        edges.push(new Edge(v1, v2));
        size += 1;
      }
    })
    v1.size = (300*size+50)/(N*(5*p+1));
    v1.degree = size;
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

function windowResized(){
  resizeCanvas(windowWidth, windowHeight - 10);
  nSlider.size(canvas.width/3);
  nSlider.position(50, canvas.height - 50);
  pSlider.size(canvas.width/3);
  pSlider.position(canvas.width - pSlider.width - 50, canvas.height - 50);
  Nodes.forEach(node => {
    node.restX *= canvas.width/prevw;
    node.restY *= canvas.height/prevh;
  })
  prevw = canvas.width;
  prevh = canvas.height;
}

class Node{
  constructor(x, y){
    this.x = this.restX = this.px = x;
    this.y = this.restY = this.py = y;
    this.size = this.degree = this.vely = this.accel = this.velx = this.movingTime = 0;
    this.over = this.move = false;
  }

  draw(){
    push()
    if(this.move)
      fill(150, 150, 150, 215)
    else
      fill(75, 75, 75, 215)
    ellipse(this.x, this.y, this.size)
    pop()
  }

  overEvent(){
		let disX = this.x - mouseX;
    let disY = this.y - mouseY;
		var dis = createVector(disX, disY);
		if (dis.mag() < this.size / 2 ) {
			return true;
		} else {
			return false;
		}
	}

  update(){ 
    this.force = -k * (this.y - this.restY);  // f=-ky 
    this.accel = 4 * this.force / (this.size+1);                 // Set the acceleration, f=ma == a=f/m 
    this.vely = 0.92*(this.vely + this.accel);         // Set the velocity 
    this.y = this.y + this.vely;           // Updated position 

    this.force = -k * (this.x - this.restX);  // f=-kx
    this.accel = 4 * this.force / (this.size+1);                 // Set the acceleration, f=ma == a=f/m 
    this.velx = 0.85*(this.velx + this.accel);         // Set the velocity 
    this.x = this.x + this.velx;           // Updated position 

    if (this.move) {
      setTimeout(()=>{
        this.px = this.x;
        this.py = this.y;
      },200)
      this.y = mouseY; 
      this.x = mouseX;
    }

    if (this.overEvent() || this.move) { 
      this.over = true;
    } else {
      this.over = false;
    }
  }

  pressed(){ 
		if (this.over) { 
      this.move = true;
    }
    else{
      this.move = false;
    }
	} 

	released(){ 
    this.move = false;
    this.restX = (this.restX + this.x) / 2;
    this.restY = (this.restY + this.y) / 2;
	}
}

class Edge{
  constructor(v1, v2){
    this.v1 = v1;
    this.v2 = v2;
  }
  draw(){
    stroke(0, 0, 0, 40)
    line(this.v1.x, this.v1.y, this.v2.x, this.v2.y)
  }
}