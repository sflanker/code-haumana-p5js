const express = require('express');
const fs = require('fs');

const router = express.Router();
const content = fs.readFileSync('.glitch-assets', 'utf8');
const rows = content.split("\n");

function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
  }
}

const assets = rows.map(tryParseJSON).filter((asset) => asset);

router.use((request, response) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  const path = request.path.substring(1);
  
  const [matching] = assets.filter((asset) => {
    if(asset.name)
      return asset.name.replace(/ /g,'%20') === path;
  });
  
  if (!matching || !matching.url) {
    return response.status(404).end("No such file");
  }
  
  return response.redirect(matching.url);
});

module.exports = router;
