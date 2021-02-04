/*******************
 * Here are some example sketches that you can copy and paste to your file to experiment with.
 *
 * PLEASE DON'T EDIT THIS FILE.
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

function algebra(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function() {
    // flip the coordinate system so it works like cartesian coordinates
    p.translate(0, p.height / 2);
    p.scale(1, -1);

    p.background(50, 10);

    p.strokeWeight(1);
    p.stroke("lightgray");
    p.line(0, 0, p.width, 0);

    p.strokeWeight(3);
    let x = (p.frameCount * 2) % p.width;

    // Lines: y = m * x + c
    p.stroke("green");
    p.point(x, 1 * x + 50);
    p.point(x, -0.5 * x + 150);

    // Quadratic functions: a * x ^ 2 + b * x + c
    // Note: dividing x by 10 to stretch things horizontally
    p.stroke("blue");
    p.point(x, 0.2 * (x / 10) ** 2 - 6 * (x / 10) - 120);

    // Exponental curve: a * (1 + r) ^ x
    p.stroke("red");
    p.point(x, 0.2 * 1.03 ** x - 50);
  };
}

function modulo(p) {
  const size = 150;
  const cycle = 10;
  let centerX, centerY;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);

    centerX = p.width / 2;
    centerY = p.height / 2;
  };

  p.draw = function() {
    p.background(255, 30);
    p.noFill();
    p.stroke("red");
    // Draw a circle that gets steadily bigger until it reaches some limit, and then go back to its initial size.
    p.strokeWeight((p.second() + 1) / cycle);
    p.circle(centerX, centerY, (((p.second() % cycle) + 1) / cycle) * size);

    p.noStroke();
    p.fill("black");
    // Draw the number we're currently using as input to our formula
    const textSize = ((p.second() % cycle) / cycle) * 15 + 10;
    p.textSize(textSize);
    p.text(p.second(), centerX - textSize * 0.5, centerY + textSize * 0.3);
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

function boids(p) {
  // derived from http://www.vergenet.net/~conrad/boids/pseudocode.html

  const flock = [];
  let frameRate = 60;
  let debugging = false;

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(frameRate);

    for (let i = 0; i < 20; i++) {
      flock.push(new boid());
    }
  };

  p.draw = function() {
    p.background(220, 100);
    p.noStroke();
    p.fill("gray");
    p.textSize(18);
    p.text("Click to add a boid.", 10, 10 + 18);
    p.text("Arrow keys to speed up/slow down.", 10, 10 + 18 * 2);
    p.text("Press ? to show vectors.", 10, 10 + 18 * 3);
    p.text(`Target Frame Rate: ${frameRate}`, 10, 10 + 18 * 4);

    for (let boid of flock) {
      boid.edges();
      boid.flock(flock);
      boid.show();
      boid.update();
    }
  };

  p.mousePressed = function() {
    let b = new boid();
    b.position = p.createVector(p.mouseX, p.mouseY);
    flock.push(b);
  };

  let paused = false;
  p.keyPressed = function(e) {
    switch (e.key) {
      case " ":
        if (!paused) {
          paused = true;
          p.noLoop();
        } else {
          paused = false;
          p.loop();
        }
        break;

      case "ArrowRight":
      case "ArrowUp":
        frameRate++;
        p.frameRate(frameRate);

        break;

      case "ArrowLeft":
      case "ArrowDown":
        if (frameRate > 1) {
          frameRate--;
          p.frameRate(frameRate);
        }

        break;

      case "?":
        debugging = !debugging;
        break;

      default:
        console.log(`Key '${e.key}'`);
    }
  };

  const gravitateDistance = 150;
  const alignDistance = 100;
  const avoidDistance = 50;
  const gravity = 0.02;
  const alignment = 0.01;
  const avoidStrength = 6;
  const avoidBias = 10;
  const maxSpeed = 4;
  const edgeMode = "bounce"; // 'wrap'

  //boids
  class boid {
    constructor() {
      this.position = p.createVector(p.random(p.width), p.random(p.height));
      this.velocity = p.createVector(p.random(), p.random());
      this.velocity.setMag(p.random(1, 4));
      this.maxSpeed = 4;
    } //constructor

    debugLine(v, color) {
      if (debugging) {
        p.stroke(color);
        p.strokeWeight(1);
        p.line(
          this.position.x,
          this.position.y,
          this.position.x + v.x,
          this.position.y + v.y
        );
      }
    }

    // Update velocity based on proximity the nearby boids
    flock(boids) {
      let neighbors = boids.filter(b => b !== this);
      let deltaV = this.flock_gravitate(boids)
        .add(this.flock_avoid(neighbors))
        .add(this.flock_align(boids));

      this.velocity.add(deltaV).limit(maxSpeed);
      this.debugLine(p5.Vector.mult(this.velocity, 5), "red");
    } // boids

    flock_gravitate(boids) {
      let center = boids
        .map(b => b.position)
        .filter(v => v.dist(this.position) < gravitateDistance)
        // Running average: current average times current count, plus new value, divided by new count
        .reduce(
          (c, v, i) => c.mult(i / (i + 1)).add(p5.Vector.mult(v, 1 / (i + 1))),
          p.createVector()
        );

      let result = center.sub(this.position).mult(gravity);
      this.debugLine(p5.Vector.mult(result, 30), "green");
      return result;
    }

    flock_align(boids) {
      let aligned = boids
        .filter(b => b.position.dist(this.position) < alignDistance)
        .map(b => b.velocity)
        // Running average: current average times current count, plus new value, divided by new count
        .reduce(
          (c, v, i) => c.mult(i / (i + 1)).add(p5.Vector.mult(v, 1 / (i + 1))),
          p.createVector()
        );

      let result = aligned.sub(this.velocity).mult(alignment);
      this.debugLine(p5.Vector.mult(result, 1000), "blue");
      return result;
    }

    flock_avoid(boids) {
      let path = boids
        .map(b => b.position)
        .filter(v => v.dist(this.position) < avoidDistance)
        .reduce(
          (c, v) =>
            c.add(
              p5.Vector.sub(this.position, v).setMag(
                avoidStrength / (v.dist(this.position) + avoidBias)
              )
            ),
          p.createVector()
        );

      this.debugLine(p5.Vector.mult(path, 30), "orange");
      return path;
    }

    update() {
      this.position.add(this.velocity);
    } //update

    show() {
      p.strokeWeight(6);
      p.stroke(0);
      p.point(this.position.x, this.position.y);
    } //show

    edges() {
      switch (edgeMode) {
        case "wrap":
          // Wrap around the screen
          if (this.position.x > p.width) {
            this.position.x = 0;
          } else if (this.position.x < 0) {
            this.position.x = p.width;
          }

          if (this.position.y > p.height) {
            this.position.y = 0;
          } else if (this.position.y < 0) {
            this.position.y = p.height;
          }
          break;
        case "bounce":
          // Bounce off the edges
          if (this.position.x > p.width) {
            this.position.x = p.width - (this.position.x - p.width);
            this.velocity.x *= -1;
          } else if (this.position.x < 0) {
            this.position.x *= -1;
            this.velocity.x *= -1;
          }

          if (this.position.y > p.height) {
            this.position.y = p.height - (this.position.y - p.height);
            this.velocity.y *= -1;
          } else if (this.position.y < 0) {
            this.position.y *= -1;
            this.velocity.y *= -1;
          }
          break;
      }
    } // edges
  } //boid
}

export var sketches = {
  Basics: basics,
  Algebra: algebra,
  Modulo: modulo,
  BrickWall: brickWall,
  Mystify: mystify,
  MouseDraw: mouseDraw,
  Waves: waves,
  Boids: boids
};

/* globals p5 */
