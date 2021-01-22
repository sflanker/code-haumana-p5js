function sketch(p) {
  let gameSize;
  let gameState;
  let size = 5;
  let dirty = true;
  // let [windowWidth, windowHeight] = [600, 600];
  let bgImage;
  
  p.preload = function() {
    bgImage = p.loadImage('https://cdn.glitch.com/0e291b8c-6059-4ca6-a0ae-84e67e1f94e7%2Fhibiscus.jpg?v=1610705583837');
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

export var sketches = {
  Default: sketch
};