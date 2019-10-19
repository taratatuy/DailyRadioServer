const express = require('express');

const config = require('./config.js');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', routes.authorization);
app.use('/user', routes.user);
app.use('/music', routes.music);

app.listen(config.PORT, console.log(`Listening on port ${config.PORT}`));
