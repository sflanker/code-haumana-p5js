/*******************
 * This file belongs to Kumu Paul
 *******************/
function randomSketch(p) {
  let gameSize;
  let gameState;
  let size = 5;
  let dirty = true;
  let bgImage;
  
  p.preload = function() {
    bgImage = p.loadImage('/assets/hibiscus.jpg');
  }
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();

    gameSize = {
      height: Math.floor(p.windowHeight / 5),
      width: Math.floor(p.windowWidth / 5)
    };
    gameState = [...Array(gameSize.height)].map(_ =>
      [...Array(gameSize.width)].map(_ => Math.round(Math.random()))
    );
  }

  p.draw = function() {
    gameState = [...Array(gameSize.height)].map(_ =>
      [...Array(gameSize.width)].map(_ => Math.round(p.randomGaussian(0, 0.7)))
    );
    p.image(bgImage, 0, 0);
    for (let row = 0; row < gameSize.height; row++) {
      for (let col = 0; col < gameSize.width; col++) {
        if (gameState[row][col]) {
          p.fill(gameState[row][col] ? 0 : 255);
          p.square(col * 5, row * 5, 5);
        }
      }
    }
    p.noLoop();
    window.setTimeout(() => p.loop(), 1000 / 12);
  }
}

function minecraftSkinViewer(p) {
  const gl = WebGLRenderingContext;
  const [X, Y, Z] = [0, 1, 2];
  const [L, T, R, B] = [0, 1, 2, 3];
  let skin;
  let scale = 5;
  
  function makeRectangularPrism(origin, width, depth, extrude) {
    let [originX, originY, originZ] = origin;
    let halfWidth = width / 2;
    let halfDepth = depth / 2;

    return {
      topFrontLeft: [originX - halfWidth, originY, originZ + halfDepth],
      topFrontRight: [originX + halfWidth, originY, originZ + halfDepth],
      topBackLeft: [originX - halfWidth, originY, originZ - halfDepth],
      topBackRight: [originX + halfWidth, originY, originZ - halfDepth],
      bottomFrontLeft: [originX - halfWidth, originY + extrude, originZ + halfDepth],
      bottomFrontRight: [originX + halfWidth, originY + extrude, originZ + halfDepth],
      bottomBackLeft: [originX - halfWidth, originY + extrude, originZ - halfDepth],
      bottomBackRight: [originX + halfWidth, originY + extrude, originZ - halfDepth],
    }
  }
  
  function normalizeTextureSide(side, width, height) {
    return [side[L] / width, side[T] / height, side[R] / width, side[B] / height];
  }
  
  function normalizeTexture(texture, width, height) {
    if (!height) {
      height = width;
    }
    
    let { top, front, right, left, back, bottom } = texture;
    return {
      top: normalizeTextureSide(top, width, height),
      front: normalizeTextureSide(front, width, height),
      right: normalizeTextureSide(right, width, height),
      left: normalizeTextureSide(left, width, height),
      back: normalizeTextureSide(back, width, height),
      bottom: normalizeTextureSide(bottom, width, height),
    };
  }

  let model = {
    head: makeRectangularPrism([0, -32, 0], 8, 8, 8),
    body: makeRectangularPrism([0, -24, 0], 8, 4, 12),
    leftArm: makeRectangularPrism([6, -24, 0], 4, 4, 12),
    rightArm: makeRectangularPrism([-6, -24, 0], 4, 4, 12),
    leftLeg: makeRectangularPrism([2, -12, 0], 4, 4, 12),
    rightLeg: makeRectangularPrism([-2, -12, 0], 4, 4, 12),
  };

  let textureCoordinates = {
    head: normalizeTexture(
      {
        top: [8, 0, 16, 8],
        front: [8, 8, 16, 16],
        right: [0, 8, 8, 16],
        left: [16, 8, 24, 16],
        back: [24, 8, 32, 16],
        bottom: [16, 0, 24, 8]
      },
      64
    ),
    body: normalizeTexture(
      {
        top: [20, 16, 28, 20],
        front: [20, 20, 28, 32],
        right: [16, 20, 20, 32],
        left: [28, 20, 32, 32],
        back: [32, 20, 40, 32],
        bottom: [28, 16, 36, 20]
      },
      64
    ),
    rightArm: normalizeTexture(
      {
        top: [44, 16, 48, 20],
        front: [44, 20, 48, 32],
        right: [40, 20, 44, 32],
        left: [48, 20, 52, 32],
        back: [52, 20, 56, 32],
        bottom: [48, 16, 52, 20]
      },
      64
    ),
    leftArm: normalizeTexture(
      {
        top: [36, 48, 40, 52],
        front: [36, 52, 40, 64],
        right: [32, 52, 36, 64],
        left: [40, 52, 44, 64],
        back: [44, 52, 48, 64],
        bottom: [40, 48, 44, 52]
      },
      64
    ),
    rightLeg: normalizeTexture(
      {
        top: [4, 16, 8, 20],
        front: [4, 20, 8, 32],
        right: [0, 20, 4, 32],
        left: [8, 20, 12, 32],
        back: [12, 20, 16, 32],
        bottom: [8, 16, 12, 20]
      },
      64
    ),
    leftLeg: normalizeTexture(
      {
        top: [20, 48, 24, 52],
        front: [20, 52, 24, 64],
        right: [16, 52, 20, 64],
        left: [24, 52, 28, 64],
        back: [28, 52, 32, 64],
        bottom: [24, 48, 28, 52]
      },
      64
    ),
  }

  function drawVertex(vertex, u, v) {
    p.vertex(vertex[X] * scale, vertex[Y] * scale, vertex[Z] * scale, u, v);
  }
  
  let first = true;
  
  function drawRectangularPrism(shape, texture) {
    if (first) {
      console.log(shape);
      console.log(texture);
      first = false;
    }
    
    // top
    p.beginShape(p.TRIANGLE_STRIP);
    drawVertex(shape.topBackLeft, texture.top[0], texture.top[1]);
    drawVertex(shape.topBackRight, texture.top[2], texture.top[1]);
    drawVertex(shape.topFrontLeft, texture.top[0], texture.top[3]);
    drawVertex(shape.topFrontRight, texture.top[2], texture.top[3]);
    p.endShape(p.CLOSE);
    
    // front
    p.beginShape(p.TRIANGLE_STRIP);
    drawVertex(shape.topFrontLeft, texture.front[0], texture.front[1]);
    drawVertex(shape.topFrontRight, texture.front[2], texture.front[1]);
    drawVertex(shape.bottomFrontLeft, texture.front[0], texture.front[3]);
    drawVertex(shape.bottomFrontRight, texture.front[2], texture.front[3]);
    p.endShape(p.CLOSE);
    
    // left (note: this is a little confusing, but the "left" side of the model is drawn using the "right" side of our rectangular prism because we're drawing it facing the camera).
    p.beginShape(p.TRIANGLE_STRIP);
    drawVertex(shape.topFrontRight, texture.left[0], texture.left[1]);
    drawVertex(shape.topBackRight, texture.left[2], texture.left[1]);
    drawVertex(shape.bottomFrontRight, texture.left[0], texture.left[3]);
    drawVertex(shape.bottomBackRight, texture.left[2], texture.left[3]);
    p.endShape(p.CLOSE);
    
    // back
    p.beginShape(p.TRIANGLE_STRIP);
    drawVertex(shape.topBackRight, texture.back[0], texture.back[1]);
    drawVertex(shape.topBackLeft, texture.back[2], texture.back[1]);
    drawVertex(shape.bottomBackRight, texture.back[0], texture.back[3]);
    drawVertex(shape.bottomBackLeft, texture.back[2], texture.back[3]);
    p.endShape(p.CLOSE);
    
    // right
    p.beginShape(p.TRIANGLE_STRIP);
    drawVertex(shape.topBackLeft, texture.right[0], texture.right[1]);
    drawVertex(shape.topFrontLeft, texture.right[2], texture.right[1]);
    drawVertex(shape.bottomBackLeft, texture.right[0], texture.right[3]);
    drawVertex(shape.bottomFrontLeft, texture.right[2], texture.right[3]);
    p.endShape(p.CLOSE);
    
    // bottom
    p.beginShape(p.TRIANGLE_STRIP);
    drawVertex(shape.bottomFrontLeft, texture.bottom[0], texture.bottom[1]);
    drawVertex(shape.bottomFrontRight, texture.bottom[2], texture.bottom[1]);
    drawVertex(shape.bottomBackLeft, texture.bottom[0], texture.bottom[3]);
    drawVertex(shape.bottomBackRight, texture.bottom[2], texture.bottom[3]);
    p.endShape(p.CLOSE);
    
    p.endShape();
  }
  
  p.preload = function() {
    skin = p.loadImage('/assets/Minecraft-Custom-Skin%202.png');
  }
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  }
  
  p.draw = function() {
    p.background('white');
    p.orbitControl(3, 2, 0.1);
    p.drawingContext.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    p.drawingContext.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    p.texture(skin);
    p.textureMode(p.NORMAL);
    p.push();
    p.translate(0, 16 * scale, 0);
    drawRectangularPrism(model.head, textureCoordinates.head);
    drawRectangularPrism(model.body, textureCoordinates.body);
    drawRectangularPrism(model.leftArm, textureCoordinates.leftArm);
    drawRectangularPrism(model.rightArm, textureCoordinates.rightArm);
    drawRectangularPrism(model.leftLeg, textureCoordinates.leftLeg);
    drawRectangularPrism(model.rightLeg, textureCoordinates.rightLeg);
    p.pop();
  }
}

function jezzball(p) {
  const [X, Y] = [0, 1];
  const GridSize = 20;
  const BallRadius = GridSize / 2;
  const WallSpeed = 50;
  
  let width, height;
  let gridWidth, gridHeight;
  
  let level = 2;
  
  let balls;
  let divider;
  let state;
  
  p.setup = function() {
    p.createCanvas(640, 480);
    
    // In the event we change dimensions make sure we're working with an
    // ingtegrally divisible grid.
    width = (gridWidth = Math.floor(p.width / GridSize)) * GridSize;
    height = (gridHeight = Math.floor(p.height / GridSize)) * GridSize;
    
    initializeLevel();
  }
  
  p.draw = function() {
    drawBackground();
    drawAndUpdateBalls();
  }
  
  function initializeLevel() {
    balls = [];
    let speed = level * 20 + 50;
    for (let i = 0; i < level; i++) {
      let angle = p.random([0.125, 0.625, 1.125, 1.625]) * Math.PI * 2;
      balls.push({
        x: p.random(GridSize * 1.5, width - GridSize * 1.5),
        y: p.random(GridSize * 1.5, height - GridSize * 1.5),
        dx: speed * Math.cos(angle),
        dy: speed * Math.sin(angle)
      })
    }
    
    state = new Array(gridWidth, gridHeight);
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1) {
          state[x, y] = -1;
        } else {
          state[x, y] = 0;
        }
      }
    }
  }
  
  function drawBackground() {
    p.background('lightgray');
    p.strokeWeight(1);
    for (let y = GridSize * 2; y < height - GridSize; y += GridSize) {
      p.stroke('white');
      p.line(GridSize, y, width - GridSize, y);
      p.stroke('darkgray');
      p.line(GridSize, y + 1, width - GridSize, y + 1);
    }
    for (let x = GridSize * 2; x < width - GridSize; x += GridSize) {
      p.stroke('white');
      p.line(x, GridSize, x, height - GridSize);
      p.stroke('darkgray');
      p.line(x + 1, GridSize, x + 1, height - GridSize);
    }
    
    p.stroke('darkgray');
    p.fill('darkgray');
    p.beginShape();
    p.vertex(GridSize - 1, height - GridSize + 1);
    p.vertex(GridSize - 1, GridSize - 1);
    p.vertex(width - GridSize + 1, GridSize - 1);
    p.vertex(width - GridSize, GridSize);
    p.vertex(GridSize, GridSize);
    p.vertex(GridSize, height - GridSize);
    p.endShape(p.CLOSE);
    
    p.stroke('white');
    p.fill('white');
    p.beginShape();
    p.vertex(width - GridSize + 1, GridSize - 1);
    p.vertex(width - GridSize + 1, height - GridSize + 1);
    p.vertex(GridSize - 1, height - GridSize + 1);
    p.vertex(GridSize, height - GridSize);
    p.vertex(width - GridSize, height - GridSize);
    p.vertex(width - GridSize, GridSize);
    p.endShape(p.CLOSE);
  }
  
  function drawAndUpdateBalls() {
    p.noStroke();
    p.fill('mediumblue');
    for (let ball of balls) {
      p.circle(ball.x, ball.y, GridSize);
      // Todo drop shaddow, specular highlight, spot?
      
      ball.x += ball.dx * p.deltaTime / 1000
      ball.y += ball.dy * p.deltaTime / 1000
      
      // This is a hacky collision detection system for a very constrained situation.
      // There are most definitely better ways to do this.
      // Also if speeds get too high, or frame rates too low, balls could totally glitch through walls.
      
      // Calculate where the left, top, right, and bottom edges of the ball are
      let [l, t, r, b] =
          [ball.x - BallRadius,
           ball.y - BallRadius,
           ball.x + BallRadius,
           ball.y + BallRadius];
      
      let xGrid = Math.floor(ball.x / GridSize);
      let yGrid = Math.floor(ball.y / GridSize);
      
      let bounced = false;
      
      if (ball.dx < 0) {
        let lGrid = Math.floor(l / GridSize);
        if (state[lGrid, yGrid] === -1) {
          // bounce right
          let boundary = (lGrid + 1) * GridSize;
          ball.dx *= -1;
          ball.x = boundary + (boundary - l) + BallRadius;
          bounced = true;
        } 
      } else if (ball.dx > 0) {
        let rGrid = Math.floor(r / GridSize);
        if (state[rGrid, yGrid] === - 1) {
          // bounce left
          let boundary = rGrid * GridSize;
          ball.dx *= -1;
          ball.x = boundary - (r - boundary) - BallRadius;
          bounced = true;
        }
      }
      if (ball.dy < 0) {
        let tGrid = Math.floor(t / GridSize);
        if (state[xGrid, tGrid] === -1) {
          // bounce down
          let boundary = (tGrid + 1) * GridSize;
          ball.dy *= -1;
          ball.y = boundary + (boundary - t) + BallRadius;
          bounced = true;
        }
      } else if (ball.dy > 0) {
        let bGrid = Math.floor(b / GridSize);
        if (state[xGrid, bGrid] === -1) {
          // bounce up
          let boundary = bGrid * GridSize;
          ball.dy *= -1;
          ball.y = boundary - (b - boundary) - BallRadius;
        }
      }
      
      if (!bounced) {
        // If no bounce has occured check for collision with a corner

        // Calculate where the northwest, northeast, sourtheast, and southwest
        // edges of the ball are (we need to check if we've collided with the corner of a block)
        let diagonalOffset = BallRadius * 0.707 // sin(45 degrees) = 0.707
//         let [nw, ne, se, sw] =
//             [[ball.x - diagonalOffset, ball.y - diagonalOffset],
//              [ball.x + diagonalOffset, ball.y - diagonalOffset],
//              [ball.x + diagonalOffset, ball.y + diagonalOffset],
//              [ball.x - diagonalOffset, ball.y + diagonalOffset]];
        
        if (ball.dx < 0) {
          if (ball.dy < 0) {
            let nw = [ball.x - diagonalOffset, ball.y - diagonalOffset];
            
          }
        }
      }
    }
  }
}

export var sketches = {
  'Minecraft Skin Viewer': minecraftSkinViewer,
  'Random Testing': randomSketch,
  'Jezzball': jezzball,
};