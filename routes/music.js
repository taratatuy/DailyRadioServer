const express = require('express');
const fs = require('fs');
const filePath = './myMusic/music.mp3';
const stat = fs.statSync(filePath);

// const { SENTRY } = require('../config.js');
// const database = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  fs.createReadStream(filePath).pipe(res);
  // console.log(stat);

  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size
  });
});

// function getMusicStream() {}

module.exports = router;
