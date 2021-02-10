/*******************
 * This file belongs to Jasyah!
 *
 * This function defines your "sketch".
 * The "p" argument is the p5js instance that you can use to call any function
 * in the p5js library.
 *
 * For a list of all the p5js methods and properties see: https://p5js.org/reference/
 *******************/
function waves(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  
  let x;
  let y;
  let isMouseOver = false;
    x = p.mouseX;
    y = p.mouseY;
  
  p.draw = function() {
    p.background("black");
    p.noFill();
    // You could also use noise or randomness to change the color of each line
    p.stroke("white");

    for (let y = 100; y < p.height - 100; y += 15) {
      p.beginShape();
      for (let x = 0; x < p.width; ++x) {
        p.vertex(x,y);
      }

      p.endShape();
    }
  };
}

export var sketches = {
  Waves: waves
};