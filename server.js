// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const assets = require('./assets');


app.use('/assets', assets);

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.get('/reboot', (req, res) => {
  res.end("OK");
  // A small timeout so that the app has the time to respond
  setTimeout(() => {
    process.exit(0);
  }, 500);
});

// http://expressjs.com/en/starter/static-files.html
app.use('/haumana', express.static('haumana'));
app.use('/lib', express.static('lib'));
app.use('/', express.static('root'));

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
