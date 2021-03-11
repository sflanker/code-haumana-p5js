export function spriteVoxelSketch(p) {
  const gl = WebGLRenderingContext;
  const scale = 10;
  const density = 1;
  const [R, G, B, A] = [0, 1, 2, 3];
  const opacityThreshold = 100;

  let sprites;
  let spritesWidth;
  let spritesHeight;
  let spriteData;
  let torchModel;
  let pistonExtModel;
  
  let models = {};
  let activeModel;
  
  let modelSelect;
  let modelListDebug = [];

  p.preload = function() {
    sprites = p.loadImage("/assets/redstone_schematic_sprites.png");
    spriteData = p.loadJSON("./kumu-paul/redstone-sprite-data.json");
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.noStroke();
    sprites.loadPixels();
    spritesWidth = sprites.width;
    spritesHeight = sprites.height;
    torchModel = spriteToVoxelGeometry(
      spriteData.sprites["torch_north_top"],
      spriteData.sprites["torch_right_side"],
      spriteData.sprites["torch_front_side"]
    );
    pistonExtModel = spriteToVoxelGeometry(
      spriteData.sprites["piston_extended_south"],
      spriteData.sprites["piston_extended_west"],
      spriteData.sprites["piston_front"],
      undefined,
      spriteData.sprites["piston_back"]
    );
    activeModel = models['Torch'] = torchModel;
    models['Piston (Extended)'] = pistonExtModel;
    
    modelSelect = p.createSelect();
    
    modelSelect.position(10, 20);
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        modelSelect.option(key);
      }
    }
    
    modelSelect.selected('Torch');
    
    modelSelect.changed(() => {
      console.log(`Switching to model: ${modelSelect.value()}`);
      activeModel = models[modelSelect.value()];
    });
    
    // now that we're done with geometry construction mape sure each pixel has non-transparent neighbors (otherwise we get unsightly seams)
    for (let x = 0; x < spritesWidth; x++) {
      for (let y = 0; y < spritesHeight; y++) {
        let ix = 4 * (y * spritesWidth * density + x * density);
        if (sprites.pixels[ix + 3] > opacityThreshold) {
          sprites.pixels[ix + 3] = 255;

          for (let [xoff, yoff] of [[-1, 0], [0, -1], [1, 0], [0, 1]]) {
            let [nx, ny] = [x + xoff, y + yoff];
            if (nx >= 0 && nx < spritesWidth && ny >= 0 && ny < spritesHeight) {
              let nix = 4 * (ny * spritesWidth * density + nx * density);
              if (sprites.pixels[nix + 3] <= opacityThreshold) {
                // bleed
                sprites.pixels[nix + 3] = sprites.pixels[ix + 3];
              }
            }
          }
        }
      }
    }
    sprites.updatePixels();
  };

  p.draw = function() {
    p.background("white");
    p.orbitControl(4, 2, 0.2);
    p.ambientLight(120);
    p.directionalLight(255, 255, 255, 0.4, 0.6, -1);
    p.textureMode(p.NORMAL);
    p.texture(sprites);
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
    p.model(activeModel);
    
    //     p.fill('red');
    //     drawVoxelsFromSprite(
    //       spriteData.sprites['torch_north_top'],
    //       spriteData.sprites['torch_left_side'],
    //       spriteData.sprites['torch_front_side'],
    //     );
  };

  // Testing the concept
  function drawVoxelsFromSprite(top, side, front) {
    for (let x = 0; x < front.w; x++) {
      for (let y = 0; y < front.h; y++) {
        let frontPixel = getSpritePixel(front.x + x, front.y + y);
        if (frontPixel[A] >= opacityThreshold) {
          for (let z = 0; z < top.h; z++) {
            if (
              getSpritePixel(top.x + x, top.y + z)[A] > opacityThreshold &&
              getSpritePixel(side.x + z, side.y + y)[A] > opacityThreshold
            ) {
              // draw voxel
              p.push();
              p.translate(x * scale, y * scale, z * scale);
              p.box(scale);
              p.pop();
            }
          }
        }
      }
    }
  }

  // There are probably much more elegant ways to do this.
  function spriteToVoxelGeometry(top, side, front, bottom, back) {
    bottom = bottom ?? top;
    back = back ?? front;
    
    function checkVoxel(xoff, yoff, zoff) {
      return (
        xoff >= 0 &&
        xoff < front.w &&
        yoff >= 0 &&
        yoff < front.h &&
        zoff >= 0 &&
        zoff < top.h &&
        getSpritePixel(front.x + xoff, front.y + yoff)[A] > opacityThreshold &&
        // Start from the "bottom" row of the top sprite
        getSpritePixel(top.x + xoff, top.y + top.h - zoff - 1)[A] >
          opacityThreshold &&
        getSpritePixel(side.x + zoff, side.y + yoff)[A] > opacityThreshold
      );
    }

    function constructGeometry() {
      // construct in slices from the front to the back
      let prevSlice = [...new Array(front.w)].map(_ =>
        new Array(front.h).fill(null)
      );
      
      modelListDebug.push(this);
      this.constructFrontOrBackFace = function(slice, sprite, faceName, x, y, z) {
        // if left, upper, or upper-left voxels share this face, re-use the vertices
        let quad = [];
        let left = x > 0 ? slice[x - 1][y] : null;
        let upper = y > 0 ? slice[x][y - 1] : null;
        let upperleft = x > 0 && y > 0 ? slice[x - 1][y - 1] : null;

        // TL
        if (upperleft && upperleft[faceName]) {
          quad.push(upperleft[faceName][3]);
        } else if (left && left[faceName]) {
          quad.push(left[faceName][1]);
        } else if (upper && upper[faceName]) {
          quad.push(upper[faceName][2]);
        } else {
          // new vertex
          this.vertices.push(p.createVector(x * scale, y * scale, -z * scale));
          this.uvs.push(normalizeUVs([sprite.x + x, sprite.y + y], "tl"));
          quad.push(this.vertices.length - 1);
        }

        // TR
        if (upper && upper[faceName]) {
          quad.push(upper[faceName][3]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector((x + 1) * scale, y * scale, -z * scale)
          );
          this.uvs.push(normalizeUVs([sprite.x + x + 1, sprite.y + y], "tr"));
          quad.push(this.vertices.length - 1);
        }

        // BL
        if (left && left[faceName]) {
          quad.push(left[faceName][3]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector(x * scale, (y + 1) * scale, -z * scale)
          );
          this.uvs.push(normalizeUVs([sprite.x + x, sprite.y + y + 1], "bl"));
          quad.push(this.vertices.length - 1);
        }

        // BR
        this.vertices.push(
          p.createVector((x + 1) * scale, (y + 1) * scale, -z * scale)
        );
        this.uvs.push(
          normalizeUVs([sprite.x + x + 1, sprite.y + y + 1], "br")
        );
        quad.push(this.vertices.length - 1);

        return quad;
      };

      this.constructTopOrBottomFace = function(
        slice,
        sprite,
        faceName,
        x,
        y,
        z,
        yoff) {
        yoff = yoff ?? 0;
        // Nomenclature is based on a top down perspective, so left is left, but "lower" is in the -z
        // If the left, lower, or lower left voxels share this face, re-use the vertices
        let quad = [];
        let left = x > 0 ? slice[x - 1][y] : null;
        let lower = prevSlice[x][y];
        let lowerLeft = x > 0 ? prevSlice[x - 1][y] : null;

        // TL
        if (left && left[faceName]) {
          quad.push(left[faceName][1]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector(x * scale, (y + yoff) * scale, (-z - 1) * scale)
          );
          this.uvs.push(
            normalizeUVs([sprite.x + x, sprite.y + sprite.h - z - 1], sprite)
          );
          quad.push(this.vertices.length - 1);
        }

        // TR
        // new vertex
        this.vertices.push(
          p.createVector((x + 1) * scale, (y + yoff) * scale, (-z - 1) * scale)
        );
        this.uvs.push(
          normalizeUVs([sprite.x + x + 1, sprite.y + sprite.h - z - 1], sprite)
        );
        quad.push(this.vertices.length - 1);

        // BL
        if (left && left[faceName]) {
          quad.push(left[faceName][3]);
        } else if (lowerLeft && lowerLeft[faceName]) {
          quad.push(lowerLeft[faceName][1]);
        } else if (lower && lower[faceName]) {
          quad.push(lower[faceName][0]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector(x * scale, (y + yoff) * scale, -z * scale)
          );
          this.uvs.push(
            normalizeUVs([sprite.x + x, sprite.y + sprite.h - z - 2], sprite)
          );
          quad.push(this.vertices.length - 1);
        }

        // BR
        if (lower && lower[faceName]) {
          quad.push(lower[faceName][1]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector((x + 1) * scale, (y + yoff) * scale, -z * scale)
          );
          this.uvs.push(
            normalizeUVs(
              [sprite.x + x + 1, sprite.y + sprite.h - z - 2],
              sprite
            )
          );
          quad.push(this.vertices.length - 1);
        }

        return quad;
      };
      this.constructSideFace = function(slice, sprite, faceName, x, y, z, xoff) {
        xoff = xoff ?? 0;

        // Nomenclature is based on a left side perspective, so upper is upper (-y), but right is +z
        // If the upper, right, or upper left voxels share this face, re-use the vertices
        let quad = [];
        let upper = y > 0 ? slice[x][y - 1] : null;
        let right = prevSlice[x][y];
        let upperRight = x > 0 && y > 0 ? prevSlice[x][y - 1] : null;

        // TL
        if (upper && upper[faceName]) {
          quad.push(upper[faceName][2]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector((x + xoff) * scale, y * scale, (-z - 1) * scale)
          );
          this.uvs.push(normalizeUVs([sprite.x + z + 1, sprite.y + y], sprite));
          quad.push(this.vertices.length - 1);
        }

        // TR
        if (upper && upper[faceName]) {
          quad.push(upper[faceName][3]);
        } else if (upperRight && upperRight[faceName]) {
          quad.push(upperRight[faceName][2]);
        } else if (right && right[faceName]) {
          quad.push(right[faceName][0]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector((x + xoff) * scale, y * scale, -z * scale)
          );
          this.uvs.push(normalizeUVs([sprite.x + z, sprite.y + y], sprite));
          quad.push(this.vertices.length - 1);
        }

        // BL
        // new vertex
        this.vertices.push(
          p.createVector((x + xoff) * scale, (y + 1) * scale, (-z - 1) * scale)
        );
        this.uvs.push(
          normalizeUVs([sprite.x + z + 1, sprite.y + y + 1], sprite)
        );
        quad.push(this.vertices.length - 1);

        // BR
        if (right && right[faceName]) {
          quad.push(right[faceName][2]);
        } else {
          // new vertex
          this.vertices.push(
            p.createVector((x + xoff) * scale, (y + 1) * scale, -z * scale)
          );
          this.uvs.push(normalizeUVs([sprite.x + z, sprite.y + y + 1], sprite));
          quad.push(this.vertices.length - 1);
        }

        return quad;
      };

      for (let z = 0; z < top.h; z++) {
        let curSlice = [...new Array(front.w)].map(_ =>
          new Array(front.h).fill(null)
        );
        let done = false;

        for (let x = 0; x < front.w; x++) {
          for (let y = 0; y < front.h; y++) {
            if (checkVoxel(x, y, z)) {
              // voxel filled
              let voxel = {};

              if (prevSlice[x][y] == null) {
                // if previous slice was null, draw front face
                let quad = this.constructFrontOrBackFace(
                  curSlice,
                  front,
                  "front",
                  x,
                  y,
                  z
                );

                this.faces.push(quad.slice(0, 3)); // 0, 1, 2
                this.faces.push([quad[2], quad[1], quad[3]]);
                voxel.front = quad;
              }

              // Maybe draw sides
              if (!checkVoxel(x - 1, y, z)) {
                // left side
                let quad = this.constructSideFace(
                  curSlice,
                  side,
                  "leftSide",
                  x,
                  y,
                  z
                );

                if (
                  quad.length != 4 ||
                  quad.some(v => v == null || this.vertices[v] == null)
                ) {
                  throw "bork";
                }

                this.faces.push(quad.slice(0, 3)); // 0, 1, 2
                this.faces.push([quad[2], quad[1], quad[3]]);
                voxel.leftSide = quad;
              }
              if (!checkVoxel(x, y - 1, z)) {
                // top side
                let quad = this.constructTopOrBottomFace(
                  curSlice,
                  top,
                  "top",
                  x,
                  y,
                  z
                );

                this.faces.push(quad.slice(0, 3)); // 0, 1, 2
                this.faces.push([quad[2], quad[1], quad[3]]);
                voxel.top = quad;
              }
              if (!checkVoxel(x + 1, y, z)) {
                // right side
                let quad = this.constructSideFace(
                  curSlice,
                  side,
                  "rightSide",
                  x,
                  y,
                  z,
                  1
                );

                this.faces.push(quad.slice(0, 3).reverse()); // 2, 1, 0
                this.faces.push([quad[2], quad[1], quad[3]].reverse());
                voxel.rightSide = quad;
              }
              if (!checkVoxel(x, y + 1, z)) {
                // bottom side
                let quad = this.constructTopOrBottomFace(
                  curSlice,
                  bottom,
                  "bottom",
                  x,
                  y,
                  z,
                  1
                );

                this.faces.push(quad.slice(0, 3).reverse()); // 2, 1, 0
                this.faces.push([quad[2], quad[1], quad[3]].reverse());
                voxel.bottom = quad;
              }

              curSlice[x][y] = voxel;
            } else if (prevSlice[x][y]) {
              // voxel empty, previous slice had a voxel, we need to draw a back face for that

              let quad = this.constructFrontOrBackFace(
                prevSlice,
                back,
                "back",
                x,
                y,
                z
              );

              this.faces.push(quad.slice(0, 3).reverse()); // 2, 1, 0
              this.faces.push([quad[2], quad[1], quad[3]].reverse());
              prevSlice.back = quad;
            }
          }
        }

        //console.log(curSlice.map(r => r.map((v, y) => !!v ? '0123456789abcdefghijklmnopqrs'[y] : ' ').join('')).join('\n'))

        prevSlice = curSlice;
      }

      // construct the last slices back faces

      for (let x = 0; x < front.w; x++) {
        for (let y = 0; y < front.h; y++) {
          if (prevSlice[x][y]) {
            // voxel empty, previous slice had a voxel, we need to draw a back face for that

            let quad = this.constructFrontOrBackFace(
              prevSlice,
              back,
              "back",
              x,
              y,
              top.h
            );

            this.faces.push(quad.slice(0, 3).reverse()); // 0, 1, 2
            this.faces.push([quad[2], quad[1], quad[3]].reverse());
            prevSlice.back = quad;
          }
        }
      }
    }

    let obj = new p5.Geometry(1, 1, constructGeometry);
    // p5js caches models by unique gid (Geometry Id)
    obj.gid = [top, side, front, bottom, back].map(f => [f.x, f.y, f.w, f.h].join(',')).join('|');
    
    obj.computeNormals();
    return obj;
  }

  function getSpritePixel(x, y) {
    let ix = 4 * (y * spritesWidth * density + x * density);
    return [
      sprites.pixels[ix],
      sprites.pixels[ix + 1],
      sprites.pixels[ix + 2],
      sprites.pixels[ix + 3]
    ];
  }

  function normalizeUVs([u, v], corner) {
    return [u / spritesWidth, v / spritesHeight];
  }
}

/* globals p5 */
