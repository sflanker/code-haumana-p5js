export function jezzball(p) {
  const debug = false;
  const [NS, EW] = [0, 1];
  const [X, Y] = [0, 1];
  const GridSize = 20;
  const BallRadius = GridSize / 2;
  const BallRadiusSquared = BallRadius ** 2;
  const DividerSpeed = 70;
  const MaxSpeed = 200;

  let width, height;
  let gridWidth, gridHeight;

  let level = 2;

  let direction = NS;
  let balls;
  let divider;
  let state;

  let intro = true;
  let restart = false;

  p.setup = function() {
    p.createCanvas(640, 480);

    // In the event we change dimensions make sure we're working with an
    // ingtegrally divisible grid.
    width = (gridWidth = Math.floor(p.width / GridSize)) * GridSize;
    height = (gridHeight = Math.floor(p.height / GridSize)) * GridSize;

    initializeLevel();
  };

  p.draw = function() {
    if (restart || p.deltaTime > (GridSize / MaxSpeed) * 1000) {
      // Skip this frame since deltaTime is too big.
      restart = false;
      return;
    }

    drawBackground();

    if (intro) {
      drawIntro();
    } else {
      updateAndDrawBalls();
      updateAndDrawDivider();
    }
  };

  p.mouseClicked = function(event) {
    if (intro) {
      intro = false;
      restart = true;
      p.cursor(direction == NS ? "ns-resize" : "ew-resize");
      p.loop();
      return;
    }

    if (event.button === 0) {
      if (!divider) {
        const originX = Math.floor(p.mouseX / GridSize);
        const originY = Math.floor(p.mouseY / GridSize);
        if (
          originX > 0 &&
          originX < gridWidth - 1 &&
          originY > 0 &&
          originY < gridHeight - 1
        ) {
          divider = {
            origin: [originX, originY],
            direction: direction,
            length: 0,
            completion: [false, false]
          };
        }
      }
    }
  };

  p.keyPressed = function(event) {
    if (event.key === " ") {
      direction = (direction + 1) % 2;
      p.cursor(direction == NS ? "ns-resize" : "ew-resize");
    }
  };

  function initializeLevel() {
    balls = [];
    divider = undefined;
    let speed = level * 10 + 60;
    for (let i = 0; i < level; i++) {
      let anglePercent = p.random([0.125, 0.625, 1.125, 1.625]);
      let angle = anglePercent * Math.PI * 2;
      balls.push({
        x: p.random(GridSize * 1.5, width - GridSize * 1.5),
        y: p.random(GridSize * 1.5, height - GridSize * 1.5),
        dx: speed * Math.cos(angle),
        dy: speed * Math.sin(angle)
      });
    }

    state = new Array(gridWidth);
    for (let x = 0; x < gridWidth; x++) {
      state[x] = new Array(gridHeight);
      for (let y = 0; y < gridHeight; y++) {
        if (x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1) {
          state[x][y] = -1;
        } else {
          state[x][y] = 0;
        }
      }
    }
  }

  function drawBackground() {
    p.background("lightgray");
    p.strokeWeight(1);
    for (let y = GridSize * 2; y < height - GridSize; y += GridSize) {
      p.stroke("white");
      p.line(GridSize, y, width - GridSize, y);
      p.stroke("darkgray");
      p.line(GridSize, y + 1, width - GridSize, y + 1);
    }
    for (let x = GridSize * 2; x < width - GridSize; x += GridSize) {
      p.stroke("white");
      p.line(x, GridSize, x, height - GridSize);
      p.stroke("darkgray");
      p.line(x + 1, GridSize, x + 1, height - GridSize);
    }

    p.stroke("darkgray");
    p.fill("darkgray");
    p.beginShape();
    p.vertex(GridSize - 1, height - GridSize + 1);
    p.vertex(GridSize - 1, GridSize - 1);
    p.vertex(width - GridSize + 1, GridSize - 1);
    p.vertex(width - GridSize, GridSize);
    p.vertex(GridSize, GridSize);
    p.vertex(GridSize, height - GridSize);
    p.endShape(p.CLOSE);

    p.stroke("white");
    p.fill("white");
    p.beginShape();
    p.vertex(width - GridSize + 1, GridSize - 1);
    p.vertex(width - GridSize + 1, height - GridSize + 1);
    p.vertex(GridSize - 1, height - GridSize + 1);
    p.vertex(GridSize, height - GridSize);
    p.vertex(width - GridSize, height - GridSize);
    p.vertex(width - GridSize, GridSize);
    p.endShape(p.CLOSE);

    p.fill("black");
    p.noStroke();
    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        if (state[x][y] === -1) {
          p.square(x * GridSize, y * GridSize, GridSize);
        }
      }
    }
  }

  function drawIntro() {
    p.cursor("default");
    p.noLoop();
    p.fill("white");
    p.stroke("darkgray");
    p.strokeWeight(2);
    p.rect(p.width * 0.2, p.height * 0.2, p.width * 0.6, p.height * 0.6);

    p.fill("black");
    p.noStroke();
    centerText("Jezzball!", 48, p.width / 2, p.height * 0.2 + 68);
    centerText(
      "Try to divide up the grid to constrain the balls to 25% of the area.\n" +
        "Click the mouse to make a wall\n" +
        "Hit Space Bar to change the wall direction.\n\n" +
        "Click anywhere to start!",
      12,
      p.width / 2,
      p.height * 0.2 + 68 + 48
    );
  }

  function centerText(str, size, x, y) {
    p.textSize(size);
    for (let line of str.split("\n")) {
      p.text(line, x - p.textWidth(line) / 2, y);
      y += size * 1.2;
    }
  }

  function updateAndDrawBalls() {
    p.noStroke();
    p.fill("mediumblue");
    for (let ball of balls) {
      ball.x += (ball.dx * p.deltaTime) / 1000;
      ball.y += (ball.dy * p.deltaTime) / 1000;

      // This is a hacky collision detection system for a very constrained situation.
      // There are most definitely better ways to do this.
      // Also if speeds get too high, or frame rates too low, balls could totally glitch through walls.

      // Calculate where the left, top, right, and bottom edges of the ball are
      let [l, t, r, b] = [
        ball.x - BallRadius,
        ball.y - BallRadius,
        ball.x + BallRadius,
        ball.y + BallRadius
      ];

      let xGrid = Math.floor(ball.x / GridSize);
      let yGrid = Math.floor(ball.y / GridSize);

      let bounced = false;

      if (ball.dx < 0) {
        let lGrid = Math.floor(l / GridSize);
        if (state[lGrid][yGrid] === -1) {
          // bounce right
          let boundary = (lGrid + 1) * GridSize;
          ball.dx *= -1;
          ball.x = boundary + (boundary - l) + BallRadius;
          bounced = true;
        }
      } else if (ball.dx > 0) {
        let rGrid = Math.floor(r / GridSize);
        if (state[rGrid][yGrid] === -1) {
          // bounce left
          let boundary = rGrid * GridSize;
          ball.dx *= -1;
          ball.x = boundary - (r - boundary) - BallRadius;
          bounced = true;
        }
      }
      if (ball.dy < 0) {
        let tGrid = Math.floor(t / GridSize);
        if (state[xGrid][tGrid] === -1) {
          // bounce down
          let boundary = (tGrid + 1) * GridSize;
          ball.dy *= -1;
          ball.y = boundary + (boundary - t) + BallRadius;
          bounced = true;
        }
      } else if (ball.dy > 0) {
        let bGrid = Math.floor(b / GridSize);
        if (state[xGrid][bGrid] === -1) {
          // bounce up
          let boundary = bGrid * GridSize;
          ball.dy *= -1;
          ball.y = boundary - (b - boundary) - BallRadius;
        }
      }

      if (!bounced) {
        // If no bounce has occured check for collision with a corner
        let diagonalOffset = BallRadius * 0.707; // sin(45 degrees) = 0.707

        let reverse = false;
        if (ball.dy < 0) {
          if (ball.dx < 0) {
            const nw = [ball.x - diagonalOffset, ball.y - diagonalOffset];
            if (
              state[Math.floor(nw[X] / GridSize)][
                Math.floor(nw[Y] / GridSize)
              ] === -1
            ) {
              reverse = true;
            }
          } else {
            const ne = [ball.x + diagonalOffset, ball.y - diagonalOffset];
            if (
              state[Math.floor(ne[X] / GridSize)][
                Math.floor(ne[Y] / GridSize)
              ] === -1
            ) {
              reverse = true;
            }
          }
        } else {
          if (ball.dx < 0) {
            const sw = [ball.x - diagonalOffset, ball.y + diagonalOffset];
            if (
              state[Math.floor(sw[X] / GridSize)][
                Math.floor(sw[Y] / GridSize)
              ] === -1
            ) {
              reverse = true;
            }
          } else {
            const se = [ball.x + diagonalOffset, ball.y + diagonalOffset];
            if (
              state[Math.floor(se[X] / GridSize)][
                Math.floor(se[Y] / GridSize)
              ] === -1
            ) {
              reverse = true;
            }
          }
        }
        if (reverse) {
          // When we collide with a corner don't worry about displacement,
          // a little overlap won't hurt anything
          ball.dx *= -1;
          ball.dy *= -1;
        }
      }

      // Draw the ball
      p.circle(ball.x, ball.y, GridSize);
      // Todo drop shadow, specular highlight, spot?
    }
  }

  function updateAndDrawDivider() {
    if (divider) {
      // Update length
      divider.length += (DividerSpeed * p.deltaTime) / 1000;
      const dividerGridLength = Math.floor(divider.length / GridSize) + 1;

      // For each direction
      // 1. Check for ball collisions
      // 2. Check for completion
      // 3. Draw divider
      if (!divider.completion[0]) {
        p.fill("red");
        if (divider.direction == NS) {
          let [rectX, rectY, rectW, rectH] = [
            divider.origin[X] * GridSize,
            divider.origin[Y] * GridSize - divider.length,
            GridSize,
            divider.length + GridSize / 2
          ];
          if (anyBallsCollide(rectX, rectY, rectW, rectH)) {
            divider.completion[0] = true;
          } else {
            if (
              state[divider.origin[X]][
                divider.origin[Y] - dividerGridLength
              ] === -1
            ) {
              divider.completion[0] = true;
              for (
                let y = divider.origin[Y] - dividerGridLength + 1;
                y <= divider.origin[Y];
                y++
              ) {
                state[divider.origin[X]][y] = -1;
              }
              checkArea();
              p.fill("black");
            }

            p.rect(rectX, rectY, rectW, rectH);
          }
        } else {
          let [rectX, rectY, rectW, rectH] = [
            divider.origin[X] * GridSize - divider.length,
            divider.origin[Y] * GridSize,
            divider.length + GridSize / 2,
            GridSize
          ];
          if (anyBallsCollide(rectX, rectY, rectW, rectH)) {
            divider.completion[0] = true;
          } else {
            if (
              state[divider.origin[X] - dividerGridLength][
                divider.origin[Y]
              ] === -1
            ) {
              divider.completion[0] = true;
              for (
                let x = divider.origin[X] - dividerGridLength + 1;
                x <= divider.origin[X];
                x++
              ) {
                state[x][divider.origin[Y]] = -1;
              }
              checkArea();
              p.fill("black");
            }

            p.rect(rectX, rectY, rectW, rectH);
          }
        }
      }
      if (!divider.completion[1]) {
        p.fill("blue");
        if (divider.direction == NS) {
          let [rectX, rectY, rectW, rectH] = [
            divider.origin[X] * GridSize,
            (divider.origin[Y] + 0.5) * GridSize,
            GridSize,
            divider.length + GridSize / 2
          ];
          if (anyBallsCollide(rectX, rectY, rectW, rectH)) {
            divider.completion[1] = true;
          } else {
            if (
              state[divider.origin[X]][
                divider.origin[Y] + dividerGridLength
              ] === -1
            ) {
              divider.completion[1] = true;
              for (
                let y = divider.origin[Y];
                y < divider.origin[Y] + dividerGridLength;
                y++
              ) {
                state[divider.origin[X]][y] = -1;
              }
              checkArea();
              p.fill("black");
            }

            p.rect(rectX, rectY, rectW, rectH);
          }
        } else {
          let [rectX, rectY, rectW, rectH] = [
            (divider.origin[X] + 0.5) * GridSize,
            divider.origin[Y] * GridSize,
            divider.length + GridSize / 2,
            GridSize
          ];
          if (anyBallsCollide(rectX, rectY, rectW, rectH)) {
            divider.completion[1] = true;
          } else {
            if (
              state[divider.origin[X] + dividerGridLength][
                divider.origin[Y]
              ] === -1
            ) {
              divider.completion[1] = true;
              for (
                let x = divider.origin[X];
                x < divider.origin[X] + dividerGridLength;
                x++
              ) {
                state[x][divider.origin[Y]] = -1;
              }
              checkArea();
              p.fill("black");
            }

            p.rect(rectX, rectY, rectW, rectH);
          }
        }
      }

      if (divider && divider.completion[0] && divider.completion[1]) {
        divider = undefined;

        let complete = 0;
        for (let y = 1; y < gridHeight - 1; y++) {
          for (let x = 1; x < gridWidth - 1; x++) {
            if (state[x][y] === -1) {
              complete++;
            }
          }
        }

        console.log(`${complete} / ${((gridWidth - 2) * (gridHeight - 2))} = ${Math.floor(complete / ((gridWidth - 2) * (gridHeight - 2)) * 100)}% complete`);

        if (complete / ((gridWidth - 2) * (gridHeight - 2)) > 0.75) {
          nextLevel();
        }
      }
    }
  }

  function anyBallsCollide(rectX, rectY, rectW, rectH) {
    for (let ball of balls) {
      let cx = Math.max(rectX, Math.min(rectX + rectW, ball.x));
      let cy = Math.max(rectY, Math.min(rectY + rectH, ball.y));

      if ((cx - ball.x) ** 2 + (cy - ball.y) ** 2 <= BallRadiusSquared) {
        return true;
      }
    }

    return false;
  }

  function checkArea() {
    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        if (state[x][y] !== -1) {
          state[x][y] = 0;
        }
      }
    }

    let rects = [];

    // Slice up the non-wall area into rectangles
    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        if (state[x][y] === 0) {
          // Build a rect
          let rect = { x: x, y: y };
          let limitX = gridWidth - 1;
          for (let ry = y; ry < gridHeight - 1 && !rect.height; ry++) {
            for (let rx = x; rx < limitX; rx++) {
              if (state[rx][ry] !== 0) {
                if (rect.width) {
                  // incomplete row
                  rect.height = ry - y;
                  break;
                } else {
                  rect.width = rx - x;
                  limitX = rx;
                }
              }
            }
            if (!rect.width) {
              rect.width = limitX - x;
            }
          }
          if (!rect.height) {
            rect.height = gridHeight - 1 - y;
          }

          rects.push(rect);
          rect.num = rects.length;
          for (let ry = rect.y; ry < rect.y + rect.height; ry++) {
            for (let rx = rect.x; rx < rect.x + rect.width; rx++) {
              state[rx][ry] = rect.num;
            }
          }

          // Skip to the right edge of the current rect
          x = rect.x + rect.width;
        }
      }
    }

    // Group rects that are touching
    let groups = [];
    while (rects.length) {
      let currentGroup = [rects.pop()];
      groups.push(currentGroup);

      for (let i = 0; i < currentGroup.length; i++) {
        let currentRect = currentGroup[i];
        for (let j = 0; j < rects.length; j++) {
          let otherRect = rects[j];
          let overlapX = Math.min(
            otherRect.x + otherRect.width - currentRect.x,
            currentRect.x + currentRect.width - otherRect.x
          );
          let overlapY = Math.min(
            otherRect.y + otherRect.height - currentRect.y,
            currentRect.y + currentRect.height - otherRect.y
          );
          
          console.log(`${JSON.stringify(currentRect)} overlaps ${JSON.stringify(otherRect)} by ${overlapX}, ${overlapY}`);

          // If overlap in both directions are not negative and at least one is
          // greater than zero, than these touch
          if (overlapX * overlapY >= 0 && overlapX + overlapY > 0) {
            currentGroup.push(otherRect);
            rects.splice(j, 1);
            j--;
          }
        }
      }
    }

    let ig = 0;
    for (let group of groups) {
      if (debug) {
        console.log(group);
        p.fill(p.noise(ig) * 255, p.noise(ig + 100) * 255, p.noise(ig + 200) * 255, 50);
        for (let rect of group) {
          let [x, y, w, h] =
              [rect.x * GridSize, rect.y * GridSize, rect.width * GridSize, rect.height * GridSize];
          if (anyBallsCollide(x, y, w, h)) {
            p.stroke('red');
          } else {
            p.stroke('green');
          }

          p.rect(x, y, w, h);
          ig++;
        }
        p.noLoop();
        window.setTimeout(() => p.loop(), 3000);
      }
      
      // does this group have any balls?
      let hasBalls =
          group.some(r =>
            anyBallsCollide(
              r.x * GridSize,
              r.y * GridSize,
              r.width * GridSize,
              r.height * GridSize
            )
          );
      if (!hasBalls) {
        // If not, paint it black
        for (let rect of group) {
          for (let y = rect.y; y < rect.y + rect.height; y++) {
            for (let x = rect.x; x < rect.x + rect.width; x++) {
              state[x][y] = -1;
            }
          }
        }
      }
    }
  }

  function nextLevel() {
    level = Math.min(level + 1, 20);
    initializeLevel();
  }
} // End of Jezzball