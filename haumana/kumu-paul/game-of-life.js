export function gameOfLife(p) {
  const size = 2;
  const useWorkers = false;
  const threadCount = 8;

  let gameSize;

  let currentState = 0;
  let buffers;
  let gameStates;
  let neighborLookup;

  let generation = 0;

  // Tracking workers
  let updateWorkers = [];
  let updateSize;
  let updateState;

  let lastUpdate;
  let updateTime;

  p.setup = function() {
    if (useWorkers) {
      if (!window.Worker) {
        alert("Web Workers Not Available!");
        return;
      }
      if (typeof SharedArrayBuffer !== "function") {
        alert("SharedArrayBuffer Not Available!");
        return;
      }
    }

    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();

    gameSize = {
      width: Math.floor(p.width / size),
      height: Math.floor(p.height / size)
    };

    if (useWorkers) {
      buffers = [
        new SharedArrayBuffer(
          Uint8Array.BYTES_PER_ELEMENT * gameSize.width * gameSize.height
        ),
        new SharedArrayBuffer(
          Uint8Array.BYTES_PER_ELEMENT * gameSize.width * gameSize.height
        )
      ];
      gameStates = [new Uint8Array(buffers[0]), new Uint8Array(buffers[1])];
    } else {
      gameStates = [
        new Uint8Array(gameSize.width * gameSize.height),
        new Uint8Array(gameSize.width * gameSize.height)
      ];
    }

    for (let ix = 0; ix < gameSize.width * gameSize.height; ix++) {
      gameStates[currentState][ix] = Math.round(p.random());
    }

    neighborLookup = [];
    for (let y = 0; y < gameSize.height; y++) {
      for (let x = 0; x < gameSize.width; x++) {
        let aboveY = y > 0 ? y - 1 : gameSize.height - 1;
        let belowY = y < gameSize.height - 1 ? y + 1 : 0;
        let leftX = x > 0 ? x - 1 : gameSize.width - 1;
        let rightX = x < gameSize.width - 1 ? x + 1 : 0;

        let width = gameSize.width;
        neighborLookup.push([
          aboveY * width + leftX,
          aboveY * width + x,
          aboveY * width + rightX,
          y * width + leftX,
          y * width + rightX,
          belowY * width + leftX,
          belowY * width + x,
          belowY * width + rightX
        ]);
      }
    }

    for (let i = 0; i < threadCount; i++) {
      let updateWorker = new Worker("./kumu-paul/game-of-life-worker.js");
      updateWorker.onmessage = handleUpdate;
      updateWorkers.push(updateWorker);
    }

    updateSize = Math.ceil(gameSize.height / threadCount);

    lastUpdate = p.millis();
    if (useWorkers) {
      beginUpdate();
    }
  };

  p.draw = function() {
    p.background(255);

    for (let row = 0; row < gameSize.height; row++) {
      for (let col = 0; col < gameSize.width; col++) {
        p.fill(gameStates[currentState][row * gameSize.width + col] ? 0 : 255);
        p.square(col * 5, row * 5, 5);
      }
    }

    p.fill("red");
    p.textSize(18);
    p.text(
      `Generation: ${generation} (${(1000 / updateTime).toFixed(1)} gps)`,
      10,
      28
    );

    if (useWorkers) {
      p.noLoop();
    } else {
      let nextState = (currentState + 1) % 2;
      updateWorld(gameStates[currentState], gameStates[nextState]);
      updateTime = p.millis() - lastUpdate;
      lastUpdate = p.millis();
      generation++;
      currentState = nextState;
    }
  };

  function beginUpdate() {
    updateState = [...Array(threadCount)].map(_ => false);
    for (let i = 0; i < threadCount; i++) {
      let startingRow = i * updateSize;
      let endingRow = Math.min(startingRow + updateSize, gameSize.height);
      updateWorkers[i].postMessage({
        oldWorldBuffer: buffers[currentState],
        newWorldBuffer: buffers[(currentState + 1) % 2],
        size: gameSize,
        range: [startingRow, endingRow],
        index: i
      });
    }
  }

  function handleUpdate(e) {
    let { range, index } = e.data;

    updateState[index] = true;

    let done = updateState.every(x => x);

    if (done) {
      updateTime = p.millis() - lastUpdate;
      lastUpdate = p.millis();
      generation++;
      currentState = (currentState + 1) % 2;

      beginUpdate();

      p.loop();
    }
  }

  function updateWorld(oldWorld, newWorld) {
    let width = gameSize.width;
    for (let y = 0; y < gameSize.height; y++) {
      for (let x = 0; x < width; x++) {
        let ix = y * width + x;
        let n = countNeighbors(oldWorld, x, y);
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
  }

  function countNeighbors(world, x, y) {
    let ix = y * gameSize.width + x;
    let neighbors = neighborLookup[ix];

    return (
      world[neighbors[0]] +
      world[neighbors[1]] +
      world[neighbors[2]] +
      world[neighbors[3]] +
      world[neighbors[4]] +
      world[neighbors[5]] +
      world[neighbors[6]] +
      world[neighbors[7]]
    );
  }
}

// Living on the edge (probably won't work in Safari)
/* globals SharedArrayBuffer */
