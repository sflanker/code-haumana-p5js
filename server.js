// server.js
// where your node app starts

// init project
const express = require("express");

const assets = require("./assets");
const watch = require("./watcher");

async function run() {
  const app = express();

  app.use("/assets", assets);

  app.get("/test", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/reboot", (req, res) => {
    res.end("OK");
    // A small timeout so that the app has the time to respond
    setTimeout(() => {
      process.exit(0);
    }, 500);
  });

  // Server-Sent Event Source for detecting static file changes
  app.get("/watch", watch);

  // http://expressjs.com/en/starter/static-files.html
  app.use("/haumana", express.static("haumana"));
  app.use("/lib", express.static("lib"));
  app.use("/", express.static("root"));

  // listen for requests :)
  const listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
  });

  await listener;
}

run().catch(err => console.log(err));