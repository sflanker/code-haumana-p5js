/*******************
 * This file belongs to Kumu Kahealani
 *
 * This function defines your "sketch".
 * The "p" argument is the p5js instance that you can use to call any function
 * in the p5js library.
 *
 * For a list of all the p5js methods and properties see: https://p5js.org/reference/
 *******************/
function sketch(p) {
  // The setup function runs once
  p.setup = function() {
    // This will create the p5js canvas so that it is the same size as the window
    p.createCanvas(p.windowWidth, p.windowHeight);
    
    // You can put any initial setup code here
    p.background('white');
  }

  // This function will be called repeatedly
  p.draw = function() {
    p.fill('coral');
    p.noStroke();
    p.circle(60, 60, 200);
    p.noFill();
    p.stroke('blue');
    p.square(60, 60, 100);
  }
}

export var sketches = {
  Basics: sketch
};