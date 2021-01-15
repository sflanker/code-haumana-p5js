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
  // Variables initialized here
  let x;
  let y;
  
  // The setup function run's once
  p.setup = function() {
    // This will create the p5js canvas so that it is the same size as the window
    p.createCanvas(p.windowWidth, p.windowHeight);
    
    // You can put any initial setup code here
    p.background('lavender');
    p.noFill();
    p.stroke(255, 0, 0);
    x = p.mouseX;
    y = p.mouseY;
    
    console.log("Sketch Initialized Successfully");
  }

  // This function will be called repeatedly
  p.draw = function() {
    // This sketch checks if the mouse has moved, if it has it draws a circle
    // based on where the mouse is located and how fast it is moving
    if (x !== p.mouseX || y !== p.mouseY) {
      let size =
          Math.sqrt(Math.pow(p.mouseX - x, 2) + Math.pow(p.mouseY - y, 2));
      
      x = p.mouseX;
      y = p.mouseY;
      
      p.circle(x, y, size);
    }
  }
}