function Star(){
  this.x=random(0,width)
  this.dx=this.x+(this.x-width/2)/25
  this.y=random(0,height)
  this.dy=this.y+(this.y-height/2)/25
  this.luminosity=random(30,255)

  this.display =function(){
    stroke(this.luminosity)
    //noStroke()
    //ellipse(this.x,this.y,this.r)
    line(this.x,this.y,this.dx,this.dy)
  }

  this.update =function(speed){
    this.x=this.dx
    this.dx=this.x+(this.x-width/2)*speed/25
    this.y=this.dy
    this.dy=this.y+(this.y-height/2)*speed/25
    //this.x+=(this.x-width/2)*speed/25
    //this.y+=(this.y-height/2)*speed/25
    //this.r+=abs(this.x-width/2)/1500+abs(this.y-height/2)/1500
    if (this.x>width || this.x<0 || this.y>height || this.y<0){
      this.x=random(3*width/7,4*width/7)
      this.dx=this.x+(this.x-width/2)*speed/25
      this.y=random(3*height/7,4*height/7)
      this.dy=this.y+(this.y-height/2)*speed/25
      //this.r=random(0.5,1)
    }
  }
}
