class Dot extends createjs.Shape {
    constructor(x, y, size) {
        super();
        this.x=x;
        this.y=y;
        this.size=size;
    }

    Hide(){
        this.graphics.beginFill(null);
        stage.removeChild(this);
    }
    Show(){
        this.graphics.beginFill("yellow").drawRect(this.x,this.y, this.size, this.size);
    }
}

class Pacman extends createjs.Sprite{
    constructor(spriteSheet, animation ){
        super(spriteSheet, animation);
    }

    checkForDotEat(){
        for(let i=0; i<dots.length;i++){
            for(let j=0; j<dots[i].length;j++){
                let dx1 = this.x - dots[i][j].x;
                let dy1 = this.y - dots[i][j].y;
                let dx2 = dots[i][j].x + dots[i][j].size-this.x;
                let dy2=dots[i][j].y+dots[i][j].size-this.y;
                if(dx1>=0 && dy1>=0 && dx2>=0 && dy2>=0){
                    console.log(this.x,this.y,dots[i][j].x,dots[i][j].y,stage.mouseX,stage.mouseY)
                    dots[i][j].Hide();
                }
            }
        }
    }
}