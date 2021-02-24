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

  let mouseRadius = 25;

  p.draw = function() {
    p.background("black");
    p.noFill();
    p.stroke("white");

    for (let y = 100; y < p.height - 100; y += 15) {
      p.beginShape();
      for (let x = 0; x < p.width; ++x) {
        let mousePositionX = p.mouseX;
        let mousePositionY = p.mouseY;
        if (
          x < mousePositionX + mouseRadius &&
          x > mousePositionX - mouseRadius
        ) {
          if (y > mousePositionY - mouseRadius && y <= mousePositionY) {
            p.vertex(x, y - (mouseRadius - (mousePositionY - y)));
          } else {
            if (y < mousePositionY + mouseRadius && y > mousePositionY) {
              p.vertex(x, y + (mouseRadius - (y - mousePositionY)));
            } else {
              p.vertex(x, y);
            }
          }
        } else {
          p.vertex(x, y);
        }
      }
      p.endShape();
    }
  };
} // End of waves sketch

function operators(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    p.frameRate(40);
    p.background(50);
  };

  p.draw = function() {
    p.background(50, 5);
    coordinateSystem(); // helper function with some coordinate system setup
    p.strokeWeight(5);

    // x will be a value from 0 to the width of the window
    let x = (p.frameCount * 4) % p.width;

    // Jasyah
    // The first argument to point() is the horizontal position (a.k.a. X)
    // The second argument to point() is the vertical position (a.k.a. Y)
    p.stroke("red");
    // Note Math.sin expects Radians, to use degrees, divide by 360 and multiply by 2 PI
    p.point(x, Math.sin((x / 360) * (2 * Math.PI)) * 100); /// use Math. to call trig functions

    // This just displays the x value you can comment it out
    debugValue(x, x);

    // ⬑⎼⎼⎼⎼ Make this more interesting
    // If the Y value is a function of X then the vertical position will change as the line goes
    // from left to right

    // ⬐⎻⎻⎻⎻ Add more lines by setting a new stroke color and drawing an additional point with a
    //       different value

    // End of Draw function
  };

  // You can use this function to help debug what is happening with your expression
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
} // End of operators sketch

// Each row here will add an entry to the sketch dropdown on your page
export var sketches = {
  // Format:
  // "Name": function,
  Waves: waves,
  Operators: operators
};
