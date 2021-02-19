/*******************
 *
 * Today we're going to be exploring operators
 *
 * All of your basic mathematical operators work in Javascript:
 *
 *     1 + 2         is equal to   3
 *     2 * 3         is equal to   6
 *
 * Javascript follows normal aritmetic order of operations Multiply/Divide, Add/Subtract
 *
 *     2 + 3 * 7     is equal to   23 (not 35)
 *
 * You can use parenthese to be explicit about order of operations
 *
 *     (2 + 3) * 7   does equal    35
 *
 * In addition to the basic arithmetic operators you all should have seen in school, javascript has
 * a few special operators you may not have seen:
 *
 *     a % b         Modulus (a.k.a. remainder) - returns the remainder after dividing b into a
 *     a ** b        Exponent - Raises a to the b power (i.e. a ** 2 is a squared)
 *
 * Examples:
 *
 *     8 % 3         is equal to   2 (because 3 goes into 8 twice, leaving a remainder of 2)
 *     2 ** 3        is equal to   8 (because 2 cubed is 2 * 2 * 2 is 8)
 *
 * In addition to operators, there are some built in math functions as well, accessible via the
 * global variable Math:
 *
 *     Math.abs(x)     Returns the absolute value of x
 *     Math.sign(x)    Returns -1 if x is negative, 1 if x is positive, or 0 of x is exactly 0
 *     Math.ceil(x)    Returns x rounded up to the next integer
 *                     (or x if it is already an integer)
 *     Math.floor(x)   Returns x rounded down to the previous integer
 *                     (or x if it is already an integer)
 *     Math.round(x)   Returns x rounded to the nearest integer
 *     Math.max(x, y)  Returns whichever is larger of x and y
 *     Math.min(x, y)  Returns whichever is smaller of x and y
 *     Math.pow(x, y)  Returns x raised to the y power (just like the ** operator)
 *     Math.sqrt(x)    Returns the square root of x (to find other roots you can use x ** (1 / y))
 *     Math.log(x)     Returns the natural logarithm of x
 *                     (the number to which euler's constant would have to be raised to equal x)
 *     Math.log10(x)   Returns the logarithm base 10 of x
 *     Math.sin(x)     Returns the Sine of x in radians
 *     Math.cos(x)     Returns the Cosine of x in radians
 *     Math.tan(x)     Returns the Tangent of x in radians
 *     Math.random()   Returns a random number between 0 and 1 (may be 0 but never actually 1)
 *
 * The Math object also includes some mathmatical constants:
 *
 *     Math.PI         An important constant for finding dimensions of a circle: 3.14159...
 *     Math.E          Euler's constant, the base of natural logarithms: 2.718...
 *
 * See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
 *
 *******************/
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

    // Draws a very boring line of points
    p.stroke("blue");
    // The first argument to point() is the horizontal position (a.k.a. X)
    // The second argument to point() is the vertical position (a.k.a. Y)
    p.point(x, 200 + x);

    // ⬑⎼⎼⎼⎼ Make this more interesting
    // If the Y value is a function of X then the vertical position will change as the line goes
    // from left to right

    // ⬐⎻⎻⎻⎻ Add more lines by setting a new stroke color and drawing an additional point with a
    //       different value

    // Jasyah
    p.stroke("red");
    p.point(x, Math.sin(x)*100); /// use Math. to call trig functions
// thank you!!
    // Ili
    p.stroke("blue");
    p.point(x, 15 + x);

    
    // Paul
    p.stroke("orange");
    p.point(x, _debugValue(x, -2 * (x - 120) ** 1.3 + 8 * (x - 120) + 27));
    
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
}

export var sketches = {
  Operators: operators
};
