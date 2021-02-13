const fs = require("fs");

async function watch(req, res) {
  let path = req.query.path;
  if (path.startsWith("/")) {
    path = "." + path;
  }

  if (!fs.existsSync(path)) {
    res.status(400).send("Specified path not found.");
  } else {
    console.log(`Watching path: ${path}`);

    res.set({
      "Cache-Control": "no-cache",
      "Content-Type": "text/event-stream",
      Connection: "keep-alive"
    });

    res.flushHeaders();

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write("retry: 10000\n\n");

    let watcher;
    let changeId = 0;
    let eventPromise = new Promise(resolve => {
      watcher = fs.watch(path, { persistent: false }, eventType => {
        let newResolve;
        // Update the promise for the next event
        eventPromise = new Promise(r => {
          newResolve = r;
        });
        resolve({ eventType, changeId: ++changeId });
        // Update the resolve function we call to be fore the new promise
        resolve = newResolve;
      });
    });

    let connected = true;

    req.on("close", () => {
      connected = false;
    });

    let pendingEvent = undefined;
    let lastChangeId = 0;
    while (connected) {
      pendingEvent = await eventPromise;

      // Batch up changes that happen in quick succession
      let currentChangeId = pendingEvent.changeId;
      // console.log(`event detected, waiting for more at ${currentChangeId}`);
      while (true) {
        // Wait 1 second to see if more events occur
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (currentChangeId === changeId) {
          break;
        } else {
          currentChangeId = changeId;
        }
      }

      // console.log(`stead state reached at ${currentChangeId}`);
      res.write(
        `data: ${pendingEvent.eventType}[${currentChangeId - lastChangeId}]\n\n`
      );

      lastChangeId = currentChangeId;
    }

    // console.log(`Shutting down watcher on file ${path}`);
    if (watcher) {
      try {
        watcher.close();
      } catch (e) {}
    }
  }
}

module.exports = watch;