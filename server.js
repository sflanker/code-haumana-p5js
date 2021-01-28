// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const assets = require('./assets');


app.use('/assets', assets);

// http://expressjs.com/en/starter/static-files.html
app.use('/haumana', express.static('haumana'));
app.use('/', express.static('root'));

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
