/*******************
 * This function defines your "sketch".
 * The "p" argument is the p5js instance that you can use to call any function
 * in the p5js library.
 *
 * Note: this file is structured for use with p5.js in "instance mode" as
 * opposed to "global mode". If you see examples that have top level functions
 * declared such as: setup, draw, preload, mousePressed, mouseReleased, etc.
 * these functions should be assigned to properties on the "p" argument when
 * using "instance mode".
 * See: https://p5js.org/examples/instance-mode-instantiation.html
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
    p.fill('red');
    p.noStroke();
    p.circle(60, 60, 50);
    p.noFill();
    p.stroke('blue');
    p.square(60, 60, 100);
  }
}

export var sketches = {
  Default: sketch
};