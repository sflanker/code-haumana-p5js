/*******************
 * This file belongs to Pili!
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
    p.background('gold');
  }

  // This function will be called repeatedly
  p.draw = function() {
    p.fill('red');
    p.noStroke();
    p.circle(60, 60, 80);
    p.noFill();
    p.stroke('black');
    p.square(60, 60, 100);
  }
} // END OF sketch 


// Each function makes a different sketch
function operators(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    p.frameRate(40); // Changing this number will change how fast lines get drawn
    p.background(50);
  };

  p.draw = function() {
    p.background(50, 5);
    coordinateSystem(); // helper function with some coordinate system setup
    p.strokeWeight(5);

    // x will be a value from 0 to the width of the window
    let x = (p.frameCount * 4) % p.width;

    p.stroke("red");
    // The first argument to point() is the horizontal position (a.k.a. X)
    // The second argument to point() is the vertical position (a.k.a. Y)
    p.point(x, 18 + x);

    // ⬑⎼⎼⎼⎼ Make this more interesting
    // If the Y value is a function of X then the vertical position will change as the line goes
    // from left to right

    // ⬐⎻⎻⎻⎻ Add more lines by setting a new stroke color and drawing an additional point with a
    //       different value

    // End of Draw function
  };

  // You can use this function to help debug what is happening with your exporession
  // To use it, can replace your y-value expression with debugValue(x, y-value expression)
  // The color parameter is optional
  // Example: p.point(x, debugValue(x, 5, 'red'));
  function debugValue(x, val, color) {
    // Debug output values
    p.push();
    p.scale(1, -1);
    p.fill(50);
    p.noStroke();
    let str = val.toFixed(1);
    p.textSize(20);
    p.rect(x, -12, p.textWidth(str) + 8, 28);
    p.fill(color ?? "white");
    p.text(str, x + 4, 10);
    p.pop();
    return val;
  }

  // To quickly turn off debugging, replace debugValue with _debugValue
  function _debugValue(x, val) {
    return val;
  }

  function coordinateSystem() {
    // Make y = 0 be the middle of the screen
    p.translate(0, p.height / 2);
    // flip the coordinate system so it works like cartesian coordinates
    p.scale(1, -1);

    // draw the x-axis
    p.strokeWeight(1);
    p.stroke("lightgray");
    p.line(0, 0, p.width, 0);
  }
} // END of operators function


// Each row here will add an entry to the sketch dropdown on your page
export var sketches = {
  // Format:
  // Name: function,
  "Operators": operators,
  "Basics": sketch,
};