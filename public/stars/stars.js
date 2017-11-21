var stars=[]

function resize_array(array,size){
  if(size>array.length){
    for (var i = 0; i < size-array.length; i++) {
      append(array, new Star())
    }
  }
  else{
    for (var i = 0; i < array.length-size; i++) {
      array.splice(size,array.length-size)
    }
  }
}

function setup(){
  createCanvas(windowWidth,windowHeight-4);
  num_Slider=createSlider(10,180,100,1);
  num_Slider.position(windowWidth-150,windowHeight-150);
  speed_slider=createSlider(0.5,2,1,0.1)
  speed_slider.position(num_Slider.x,num_Slider.y+50)

  for (var i = 0; i < 100; i++) {
    stars[i]=new Star();
  }
}

function draw(){
  background(0);
  for (var i = 0; i < stars.length; i++) {
    stars[i].update(speed_slider.value())
    stars[i].display()
  }
  stroke(0)
  resize_array(stars,num_Slider.value())
  fill(255)
  text('Amount of stars',num_Slider.x,num_Slider.y+num_Slider.height*2)
  text('Speed',speed_slider.x,speed_slider.y+speed_slider.height*2)
}
