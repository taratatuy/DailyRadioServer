const express = require('express');
const MM = require('music-metadata');
const fs = require('fs');
const formidable = require('formidable');
const util = require('util');
const { SENTRY } = require('../config.js');

const ReadDirP = util.promisify(fs.readdir);
const router = express.Router();

router.get('/playlist', async (req, res) => {
  try {
    const files = await ReadDirP('./Music');
    if (!files[0]) return res.status(503);

    files.sort(() => Math.random() - 0.5);
    res.json(files);
  } catch (err) {
    SENTRY.captureException('Get playlist processing error: ', err);
    res.status(500).end('Internal Server Error');
  }
});

router.get('/play/:name', (req, res) => {
  try {
    const name = req.params.name;
    if (name === 'undefined')
      return res.status(404).json({ message: 'Cant find track.' });

    const filePath = './Music/' + name;
    const stat = fs.statSync(filePath);

    fs.createReadStream(filePath).pipe(res);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });
  } catch (err) {
    res.status(404).json({ message: 'Cant find track.' });
  }
});

router.get('/play/:name/stats', (req, res) => {
  const name = req.params.name;
  if (name === 'undefined')
    return res.status(404).json({ message: 'Cant find track.' });

  const filePath = './Music/' + name;

  MM.parseFile(filePath)
    .then(({ common }) => {
      const picture = common.picture || [undefined];
      res.json({
        title: common.title,
        artist: common.artist,
        picture: picture[0]
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404);
    });
});

router.get('/database', (req, res) => {
  res.sendFile('../public/musicDatabase/index.html', { root: __dirname });
});

router.get('/database/music', async (req, res) => {
  const files = await ReadDirP('./Music');
  if (!files[0])
    return res.json([
      {
        title: 'No files found.',
        artist: '',
        album: '',
        fileName: '',
        checked: false
      }
    ]);

  let songsData = [];
  await Promise.all(
    files.map(async file => {
      let { common } = await MM.parseFile(`./Music/${file}`);
      songsData.push({
        title: common.title,
        artist: common.artist,
        album: common.album,
        fileName: file,
        checked: false
      });
    })
  ).catch(err => {
    console.log(err.message);
  });

  res.json(songsData);
});

router.post('/database/delete', async (req, res) => {
  let { titles } = req.body;
  if (!titles) res.status(400).json({ message: 'Wrong post data.' });

  try {
    titles.map(title => {
      fs.unlink(`./Music/${title}`, err => {});
    });
    res.json({ message: 'All files deleted.' });
  } catch (err) {
    res.end(err.message);
  }
});

router.post('/database/upload', (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) return res.status(400);

      files = Object.values(files);

      files.forEach(file => {
        const oldpath = file.path;
        const newpath = './Music/' + file.name;
        fs.rename(oldpath, newpath, err => {
          if (err) return;
        });
      });
      res.redirect('/dbmusic');
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
