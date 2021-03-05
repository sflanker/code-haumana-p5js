/*******************
 *
 * Today we're going to be exploring if blocks.
 *
 * If blocks make it possible to execute code only when a certain condition is
 * true.
 *
 * This is the simplest form of an if block:
 *
 *     if (condition) {
 *         // code to execute if condition is true
 *     }
 *
 * An if block can also have an else block attached, the code in the else block
 * executes only if the condition is false:
 *
 *     if (condition) {
 *         // code to execute if the condition is true
 *     } else {
 *         // code to execute if the condition is false
 *     }
 *
 * If blocks can be strung together, each condition will be exclusive of those
 * following it.
 *
 *     if (conditionA) {
 *         // code to execute if conditionA is true
 *     } else if (conditionB) {
 *         // code to execute if conditionA is false and conditionB is true
 *         // NOTE: this will not execute if conditionA is true, even if
 *         // conditionB is also true.
 *     } else {
 *         // code to execute if neither conditionA nor conditionB is true.
 *     }
 *
 * Conditions can be an expression, meaning a variable, a function call, or an
 * expression with operators. But the expression should return a boolean value
 * (i.e. true or false)
 *
 * Javascript has a number of special operators, or comparissons that return
 * true or false.
 *
 *     a == b    Equality    Returns true if a and b are equal (note: be careful
 *                           not to accidently use a single = because that will
 *                           assign a value to the variable on the left)
 *
 *     a > b     Greater Than    Returns true if a is greater than b
 *     a < b     Less Than
 *     a >= b    Greater Than or Equal
 *     a <= b    Less Than or Equal
 *     a != b    Not Equal
 *
 * You can also combine multiple conditions using "boolean logic operators"
 *
 *     a > 5 && a < 10     Logical And (&&)   Returns true if a is between 5
 *                                            and 10 in this example.
 *
 *     a < -10 || a > 10   Logical Or (||)    Returns true if a is greater than
 *                                            10 or less than -10 in this
 *                                            example.
 *
 * Lastly you can negate a condition with the "not" or "negation" operator.
 *
 *     !(a > 5)            Logical Not (!)    Returns true if a is not greater
 *                                            than 5.
 *
 *******************/
function conditions(p) {
  const size = 10;
  const spacing = 2;
  let x = 0;
  let y = 0;
  let i = 0;
  let rowWidth;
  let columnWidth;
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    p.frameRate(60);
    p.background('white');
    p.noStroke();
    rowWidth = Math.floor(p.width / (size + spacing));
    columnWidth = Math.floor(rowWidth / 4);
  };

  p.draw = function() {
    i = y * rowWidth + x;
    
    if (x / rowWidth < 0.25) {
      if (y > x && y <= columnWidth) {
        p.fill('pink');
      } else if (y > columnWidth & x < (columnWidth - (y - columnWidth) + 2)) {
        p.fill('orange');
      } else if (p.random() > y / (columnWidth * 4)) {
        p.fill('green');
      } else {
        p.fill('red');
      }
    } else if (x / rowWidth < 0.5) {
      // ====================
      // Ili
      // ====================
      if(i% 5==0){
        p.fill('blue');
      } else {
        // Ili, I added this so my pattern wouldn't run into yours. -Kumu Paul
        p.fill('white');
      }
    } else if (x / rowWidth < 0.75) {
      // ===============================
      // Pili
      // ===============================
      p.fill('green');
    } else if (x / rowWidth < 1.0) {
      // Jasyah
      p.fill('maroon');
    }
    
    // Draw a square
    p.square(
      (x + 1) * spacing + x * size,
      (y + 1) * spacing + y * size,
      size
    );
    
    // Update x to the right
    x = x + 1;
    if (x >= rowWidth) {
      // When we get to the right edge of the window, go back to the left edge
      x = 0;
      // And move down one row
      y = y + 1;
    }
    
    // End of Draw function
  };
}

export var sketches = {
  Conditions: conditions
};
