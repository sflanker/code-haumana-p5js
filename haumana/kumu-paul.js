function sketch(p) {
  let gameSize;
  let gameState;
  let size = 5;
  let dirty = true;
  let [windowWidth, windowHeight] = [600, 600];
  
  p.setup = function() {
    p.createCanvas(windowWidth, windowHeight);
    p.background(255);
    p.noStroke();

    gameSize = {
      height: Math.floor(windowHeight / 5),
      width: Math.floor(windowWidth / 5)
    };
    gameState = [...Array(gameSize.height)].map(_ =>
      [...Array(gameSize.width)].map(_ => Math.round(Math.random()))
    );
  }

  p.draw = function() {
    if (gameState) {
      if (dirty) {
        for (let row = 0; row < gameSize.height; row++) {
          for (let col = 0; col < gameSize.width; col++) {
            p.fill(gameState[row][col] ? 0 : 255);
            p.square(col * 5, row * 5, 5);
          }
        }
        dirty = false;
      }
    } else {
      console.log("missing gameState");
    }
  }
}