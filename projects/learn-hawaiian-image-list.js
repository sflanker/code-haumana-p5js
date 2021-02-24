export default function makeImageListSketch(allImageNames, allColorsEN, allObjectsEN) {
  return function imageList(p) {
    const spacing = 0.05;
    const labelSize = 16;
    let scrollPosition = 0;
    let columns = 2;
    let rows;
    let images;

    p.preload = function() {
      console.log(`Preloading ${allImageNames.length} images`);
      images = allImageNames.map(n => p.loadImage(`/assets/${n}`));
    }

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);

      console.log('Initializing Image List');
      p.fill('red');
      p.textSize(labelSize);
      p.textAlign(p.CENTER, p.TOP);
      p.noLoop();

      rows = Math.ceil(images.length / columns);

      /* For Cheaters
      for (let color of allColorsEN) {
        let imageIx = allImageNames.map((n, ix) => [n, ix]).filter(r => r[0].split('-')[0] === color).map(r => r[1]);
        console.log(`"${color}": [${imageIx.join(', ')}]`);
      }
      
      for (let obj of allObjectsEN) {
        let imageIx = allImageNames.map((n, ix) => [n.split('.')[0], ix])
          .filter(r => r[0].split('-')[1] === obj)
          .map(r => r[1]);
        console.log(`"${obj}": [${imageIx.join(', ')}]`);
      }*/
    };

    p.draw = function() {
      p.background("white");

      let spacingPixels = Math.floor(spacing * p.width);
      let imageWidth = Math.floor((p.width - spacingPixels * (columns + 1)) / columns);

      for (let i = 0; i < images.length; i++) {
        let c = (i % columns);
        let r = Math.floor(i / columns);
        let x = spacingPixels + (spacingPixels + imageWidth) * c;
        let y = spacingPixels + (spacingPixels + imageWidth + labelSize) * r - scrollPosition;

        if (y + imageWidth > 0 && y < p.height) {
          let img = images[i];
          let sq = Math.min(img.width, img.height);
          let xoff = (img.width - sq) / 2;
          let yoff = (img.height - sq) / 2;
          p.image(img, x, y, imageWidth, imageWidth, xoff, yoff, sq, sq);
          p.text(`${i}: ${allImageNames[i]}`, x + imageWidth / 2, y + imageWidth + 4);
        }
      }
      // End of Draw function
    };

    p.mouseWheel = function(e) {
      let spacingPixels = Math.floor(spacing * p.width);
      let imageWidth = Math.floor((p.width - spacingPixels * (columns + 1)) / columns);
      scrollPosition = Math.max(0, Math.min(scrollPosition + e.delta, (spacingPixels + imageWidth + labelSize) * rows))
      p.redraw();
    }

    p.keyPressed = function(e) {
      switch (e.key) {
        case "+":
          if (columns < 6) {
            columns++;
            rows = Math.ceil(images.length / columns);
            p.redraw();
          }
          break;
        case "-":
          if (columns > 1) {
            columns--;
            rows = Math.ceil(images.length / columns);
            p.redraw();
          }
          break;
      }
    };
  }
}