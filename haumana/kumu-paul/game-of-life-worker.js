onmessage = function(e) {
  let { oldWorldBuffer, newWorldBuffer, size, range, index } = e.data;
  
  let oldWorld = new Uint8Array(oldWorldBuffer);
  let newWorld = new Uint8Array(newWorldBuffer);

  let width = size.width;
  for (let y = range[0]; y < range[1]; y++) {
    for (let x = 0; x < width; x++) {
      let ix = y * width + x;
      let n = countNeighbors(oldWorld, size, x, y);
      switch (n) {
        case 0:
        case 1:
          // Death by underpopulation
          newWorld[ix] = 0;
          break;
        case 2:
          // No change
          newWorld[ix] = oldWorld[ix];
          break;
        case 3:
          // Spawn
          newWorld[ix] = 1;
          break;
        default:
          // > 3
          // Death by overpopulation
          newWorld[ix] = 0;
          break;
      }
    }
  }

  postMessage({ range, index });
}

function countNeighbors(world, size, x, y) {
  // pre-calculate this?
  let width = size.width;
  let aboveY = y > 0 ? y - 1 : size.height - 1;
  let belowY = y < size.height - 1 ? y + 1 : 0;
  let leftX = x > 0 ? x - 1 : size.width - 1;
  let rightX = x < size.width - 1 ? x + 1 : 0;

  return (
    world[aboveY * width + leftX] +
    world[aboveY * width + x] +
    world[aboveY * width + rightX] +
    world[y * width + leftX] +
    world[y * width + rightX] +
    world[belowY * width + leftX] +
    world[belowY * width + x] +
    world[belowY * width + rightX]
  );
}