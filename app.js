const express = require('express');

const config = require('./config.js');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/auth', routes.authorization);
app.use('/user', routes.user);
app.use('/music', routes.music);

app.listen(config.PORT, console.log(`Listening on port ${config.PORT}`));
