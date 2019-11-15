const express = require('express');
const cors = require('cors');

const config = require('./config.js');
const routes = require('./routes');

const app = express();

app.use(express.static(__dirname + '/public/musicDatabase'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/dbmusic', (req, res) => {
  res.sendFile(__dirname + '/public/musicDatabase/index.html');
});

app.use(cors());

app.use('/auth', routes.authorization);
app.use('/user', routes.user);
app.use('/music', routes.music);
app.use('/favorites', routes.favorites);

app.listen(config.PORT, console.log(`Listening on port ${config.PORT}`));
