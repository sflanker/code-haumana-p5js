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
function basics(p) {
  // The setup function run's once
  p.setup = function() {
    // This will create the p5js canvas so that it is the same size as the window
    p.createCanvas(p.windowWidth, p.windowHeight);

    // You can put any initial setup code here
  };

  // This function will be called repeatedly
  p.draw = function() {
    // clear the window
    p.background("white");

    // Draw a solid red circle
    p.fill("red");
    p.noStroke();
    p.circle(60, 60, 50);

    // Draw the outline of a blue square on top of the red circle
    p.noFill();
    p.stroke("blue");
    p.square(60, 60, 100);
  };
}

function brickWall(p) {
  let x = 10;
  let y = 10;
  let brickHeight = 20;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
  };

  p.draw = function() {
    p.noStroke();
    p.fill(200, 50, 50);

    // Make a brick with a random width
    var brickWidth = p.random(50, 120);
    p.rect(x, y, brickWidth, brickHeight);

    // Update x to the right
    x = x + brickWidth + 10;
    if (x > p.width) {
      // When we get to the right edge of the window, go back to the left edge
      x = p.width - x;
      // And move down one row
      y = y + brickHeight + 10;
    }
  };
}

// A simplified version of the classic windows screensaver
function mystify(p) {
  const maxSpeed = 20;
  // declare variables
  let x1, y1, dx1, dy1, x2, y2, dx2, dy2;
  let r, g, b;
  let dr, dg, db;
  let width, height;

  p.setup = function() {
    width = p.windowWidth;
    height = p.windowHeight;
    p.createCanvas(width, height);
    // Slow things down
    p.frameRate(20);
    // generate initial position
    x1 = p.random(width);
    y1 = p.random(height);
    x2 = p.random(width);
    y2 = p.random(height);
    // generate rate of movement in pixels per second:
    dx1 = p.random(-1 * maxSpeed, maxSpeed);
    dy1 = p.random(-1 * maxSpeed, maxSpeed);
    dx2 = p.random(-1 * maxSpeed, maxSpeed);
    dy2 = p.random(-1 * maxSpeed, maxSpeed);
    // generate random color
    r = p.random(255);
    g = p.random(255);
    b = p.random(255);
    // generate random rate of color change
    dr = p.random(-1 * maxSpeed, maxSpeed);
    dg = p.random(-1 * maxSpeed, maxSpeed);
    db = p.random(-1 * maxSpeed, maxSpeed);
  };

  p.draw = function() {
    p.background(0, 20);

    // Draw line
    p.stroke(r, g, b);
    p.line(x1, y1, x2, y2);

    // Update values
    x1 = x1 + dx1;
    y1 = y1 + dy1;
    x2 = x2 + dx2;
    y2 = y2 + dy2;

    r = r + dr;
    g = g + dg;
    b = b + db;

    // Check boundaries

    if (x1 < 0) {
      // If x moves off the left side of the window, make it bounce to the right
      // However far x moved off the screen, make it that far onto the screen
      x1 = x1 * -1;
      // Reverse the direction in which x is moving.
      dx1 = dx1 * -1;
    } else if (x1 > width) {
      // If x moves off the right side of the window, make it bounce to the left
      x1 = 2 * width - x1;
      // Reverse the direction in which x is moving.
      dx1 = dx1 * -1;
    }
    // Do the same for y (except with the top and bottom of the screen)
    if (y1 < 0) {
      y1 = y1 * -1;
      dy1 = dy1 * -1;
    } else if (y1 > height) {
      y1 = 2 * height - y1;
      dy1 = dy1 * -1;
    }

    // Do the same for the second point
    if (x2 < 0) {
      x2 = x2 * -1;
      dx2 = dx2 * -1;
    } else if (x2 > width) {
      x2 = 2 * width - x2;
      dx2 = dx2 * -1;
    }
    if (y2 < 0) {
      y2 = y2 * -1;
      dy2 = dy2 * -1;
    } else if (y2 > height) {
      y2 = 2 * height - y2;
      dy2 = dy2 * -1;
    }

    // Color channel values must be between 0 and 255.
    // Make these values "bounce" just like our position values.
    if (r < 0) {
      r = r * -1;
      dr = dr * -1;
    } else if (r > 255) {
      r = 511 - r;
      dr = dr * -1;
    }
    if (g < 0) {
      g = g * -1;
      dg = dg * -1;
    } else if (g > 255) {
      g = 511 - g;
      dg = dg * -1;
    }
    if (b < 0) {
      b = b * -1;
      db = db * -1;
    } else if (b > 255) {
      b = 511 - b;
      db = db * -1;
    }
  };
}

function mouseDraw(p) {
  // declare variables
  let x;
  let y;
  let isMouseOver = false;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // give the window a solid background color
    p.background("lavender");
    // make our shapes draw as just a red outline.
    p.noFill();
    p.stroke(255, 0, 0);

    // get the initial position of the mouse.
    x = p.mouseX;
    y = p.mouseY;
  };

  p.draw = function() {
    // This sketch checks if the mouse has moved, if it has it draws a circle
    // based on where the mouse is located and how fast it is moving
    if (x !== p.mouseX || y !== p.mouseY) {
      if (!isMouseOver) {
        isMouseOver = true;
        // Update our x and y variables to the new position
        x = p.mouseX;
        y = p.mouseY;
        // Skip drawing when the mouse first moves.
        return;
      }

      let size =
        // Measure the distance that the mouse moved since our last frame
        Math.sqrt(Math.pow(p.mouseX - x, 2) + Math.pow(p.mouseY - y, 2));

      // Update our x and y variables to the new position
      x = p.mouseX;
      y = p.mouseY;

      // Draw a circle, centered on the current mouse position
      // and with a size based on the distance the mouse moved
      p.circle(x, y, size);
    }
  };
}

// Credit: Craig S. Kaplan https://openprocessing.org/sketch/683686
function waves(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function() {
    p.background("black");
    p.noFill();
    // You could also use noise or randomness to change the color of each line
    p.stroke("white");

    for (let y = 100; y < p.height - 100; y += 10) {
      p.beginShape();
      for (let x = 0; x < p.width; ++x) {
        p.vertex(
          x,
          y -
            // Try changing parts of this formula to see how the waves change
            // This part effects where the main peak is
            (80 / (1 + p.pow(x - 150, 4) / 8e6)) *
              // The x component effects how wiggly the lines are
              // The frameCount component effects how fast things change
              // The y component effects how different each line is from the one above it
              p.noise(x / 30 + p.frameCount / 20 + y)
        );
      }

      p.endShape();
    }
  };
}

export var sketches = {
  Basics: basics,
  BrickWall: brickWall,
  Mystify: mystify,
  MouseDraw: mouseDraw,
  Waves: waves
};
