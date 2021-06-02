const path = require('path');
const express = require('express');
const morgan = require('morgan');
const minify = require('express-minify');
const useragent = require('express-useragent');

// Set a default port unless invoked with `$ HTTP_PORT=XXXX node http-server.js`
const port = process.env.HTTP_PORT || 7000;
const app = express();

// All of our routes (ie. endpoint + router)
const routes = require('./routes');

app.set('views', './src');
app.set('view engine', 'ejs');

// Middleware
app.use(minify());
app.use(express.static('dist'));
app.use('/assets', express.static('assets'));
app.use(morgan('combined'));
app.use(useragent.express());

// `routes` is an object of { endpoint: router, ... }
Object.entries(routes).forEach((entry) => {
  const [endpoint, router] = entry;
  app.use(endpoint, router);
});

// Captures all routes which hasn't been defined
app.use((req, res) => {
  // const dir = path.resolve(__dirname, 'src');
  // res.sendFile(`${dir}/index.html`);
  const ua = req.useragent.browser.toLowerCase().replace(/\s+/g, '-');
  res.render('index', { ua });
});

app.listen(port, () => {
  console.log(`[HTTP]: Started listening on port :${port}`);
});
