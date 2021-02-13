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
    // its break time UwU
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
            //or here? one of the two
            p.vertex(x, y - (mouseRadius - (mousePositionY - y)));
          } else {
            if (y < mousePositionY + mouseRadius && y > mousePositionY) {
              // my math here is wrong...
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
}

export var sketches = {
  Waves: waves
};
