/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const webpack = require('webpack');

process.env.PRESERVE_OUTPUT = true;
const config = require('./webpack.config');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    stats: config.stats,
    publicPath: '/' + config.output.publicPath,
  }));
  
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use(express.static(path.resolve(__dirname, 'public')));
}

const staticFileRegex = /^\/dist\/.+\.((?:js)|(?:css)|(?:pcss)|(?:jpg)|(?:jpeg)|(?:png)|(?:wav)|(?:mp3))$/ig;
app.get('*', (req, res, next) => {
  if(!staticFileRegex.test(req.originalUrl)) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else
    next();
});

app.listen(8080, 'localhost', (err) => {
  if(err) {
    console.log(err);
    return;
  }
  
  console.log('Listening at 8080');
});
