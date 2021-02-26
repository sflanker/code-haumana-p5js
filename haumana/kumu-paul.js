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
    bgImage = p.loadImage("/assets/hibiscus.jpg");
  };

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
  };

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
  };
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
      bottomFrontLeft: [
        originX - halfWidth,
        originY + extrude,
        originZ + halfDepth
      ],
      bottomFrontRight: [
        originX + halfWidth,
        originY + extrude,
        originZ + halfDepth
      ],
      bottomBackLeft: [
        originX - halfWidth,
        originY + extrude,
        originZ - halfDepth
      ],
      bottomBackRight: [
        originX + halfWidth,
        originY + extrude,
        originZ - halfDepth
      ]
    };
  }

  function normalizeTextureSide(side, width, height) {
    return [
      side[L] / width,
      side[T] / height,
      side[R] / width,
      side[B] / height
    ];
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
      bottom: normalizeTextureSide(bottom, width, height)
    };
  }

  let model = {
    head: makeRectangularPrism([0, -32, 0], 8, 8, 8),
    body: makeRectangularPrism([0, -24, 0], 8, 4, 12),
    leftArm: makeRectangularPrism([6, -24, 0], 4, 4, 12),
    rightArm: makeRectangularPrism([-6, -24, 0], 4, 4, 12),
    leftLeg: makeRectangularPrism([2, -12, 0], 4, 4, 12),
    rightLeg: makeRectangularPrism([-2, -12, 0], 4, 4, 12)
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
    )
  };

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
    p.vertexNormal(0, -1, 0);
    drawVertex(shape.topBackLeft, texture.top[0], texture.top[1]);
    drawVertex(shape.topBackRight, texture.top[2], texture.top[1]);
    drawVertex(shape.topFrontLeft, texture.top[0], texture.top[3]);
    drawVertex(shape.topFrontRight, texture.top[2], texture.top[3]);
    p.endShape(p.CLOSE);

    // front
    p.beginShape(p.TRIANGLE_STRIP);
    p.vertexNormal(0, 0, 1);
    drawVertex(shape.topFrontLeft, texture.front[0], texture.front[1]);
    drawVertex(shape.topFrontRight, texture.front[2], texture.front[1]);
    drawVertex(shape.bottomFrontLeft, texture.front[0], texture.front[3]);
    drawVertex(shape.bottomFrontRight, texture.front[2], texture.front[3]);
    p.endShape(p.CLOSE);

    // left (note: this is a little confusing, but the "left" side of the model is drawn using the "right" side of our rectangular prism because we're drawing it facing the camera).
    p.beginShape(p.TRIANGLE_STRIP);
    p.vertexNormal(1, 0, 0);
    drawVertex(shape.topFrontRight, texture.left[0], texture.left[1]);
    drawVertex(shape.topBackRight, texture.left[2], texture.left[1]);
    drawVertex(shape.bottomFrontRight, texture.left[0], texture.left[3]);
    drawVertex(shape.bottomBackRight, texture.left[2], texture.left[3]);
    p.endShape(p.CLOSE);

    // back
    p.beginShape(p.TRIANGLE_STRIP);
    p.vertexNormal(0, 0, -1);
    drawVertex(shape.topBackRight, texture.back[0], texture.back[1]);
    drawVertex(shape.topBackLeft, texture.back[2], texture.back[1]);
    drawVertex(shape.bottomBackRight, texture.back[0], texture.back[3]);
    drawVertex(shape.bottomBackLeft, texture.back[2], texture.back[3]);
    p.endShape(p.CLOSE);

    // right
    p.beginShape(p.TRIANGLE_STRIP);
    p.vertexNormal(-1, 0, 0);
    drawVertex(shape.topBackLeft, texture.right[0], texture.right[1]);
    drawVertex(shape.topFrontLeft, texture.right[2], texture.right[1]);
    drawVertex(shape.bottomBackLeft, texture.right[0], texture.right[3]);
    drawVertex(shape.bottomFrontLeft, texture.right[2], texture.right[3]);
    p.endShape(p.CLOSE);

    // bottom
    p.beginShape(p.TRIANGLE_STRIP);
    p.vertexNormal(0, 1, 0);
    drawVertex(shape.bottomFrontLeft, texture.bottom[0], texture.bottom[1]);
    drawVertex(shape.bottomFrontRight, texture.bottom[2], texture.bottom[1]);
    drawVertex(shape.bottomBackLeft, texture.bottom[0], texture.bottom[3]);
    drawVertex(shape.bottomBackRight, texture.bottom[2], texture.bottom[3]);
    p.endShape(p.CLOSE);

    p.endShape();
  }

  p.preload = function() {
    skin = p.loadImage("/assets/Minecraft-Custom-Skin%202.png");
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    
    // patch p5 js if it is missing vertexNormal
    if (!p.vertexNormal) {
      // no-op
      p.vertexNormal = function() {};
    }
  };

  p.draw = function() {
    p.background("white");
    p.orbitControl(3, 2, 0.1);
    p.ambientLight(60, 60, 60);
    p.directionalLight(255, 255, 255, p._renderer._curCamera.eyeX * -1, p._renderer._curCamera.eyeY * -1, p._renderer._curCamera.eyeZ * -1);
    p.drawingContext.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      gl.NEAREST
    );
    p.drawingContext.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.NEAREST
    );
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
  };
}

function mouse_waves(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  
  let mouseHistory = [];
  
  p.draw = function() {
    mouseHistory.unshift(p.createVector(p.mouseX, p.mouseY));
    if (mouseHistory.length > 100) {
      mouseHistory.pop();
    }
    
    p.background("black");
    p.noFill();
    // You could also use noise or randomness to change the color of each line
    p.stroke("white");

    for (let y = 100; y < p.height - 100; y += 15) {
      p.beginShape();
      for (let x = 0; x < p.width; ++x) {
        let offset = 0;
        let closestPoint;
        
        for (let i = 0; i < mouseHistory.length; i++) {
          let mousePos = mouseHistory[i];
          let curX = x + i * 5;
          let dist = p.createVector(curX, y).dist(mousePos);
          let deltaY = Math.abs(y - mousePos.y);
          let newOffset = dist < 30 ? Math.sqrt(30 - dist) * Math.min(2, Math.pow(deltaY, 2) / 20) : 0;
          if (mousePos.y > y) {
            newOffset *= -1;
          }
          newOffset *= Math.sin(i);
          
          if (Math.abs(newOffset) > Math.abs(offset)) {
            offset = newOffset;
          }
        }
        
        p.vertex(x, y + offset);
      }
      p.endShape();
     
    }
  };
}

export var sketches = {
  "Shader Studio": import(`./kumu-paul/shader-studio.js?nonce=${Math.random()}`).then(module => module.shaderStudio).catch(err => console.log('Bad Shader Studio')),
  "Minecraft Skin Viewer": minecraftSkinViewer,
  "Random Testing": randomSketch,
  Jezzball: import('./kumu-paul/jezzball.js').then(module => module.jezzball),
  "Conway's Game of Life": import('./kumu-paul/game-of-life.js').then(module => module.gameOfLife),
  "Mouse Waves": mouse_waves
};
