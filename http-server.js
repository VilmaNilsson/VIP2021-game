const path = require('path');
const express = require('express');

// Set a default port unless invoked with `$ HTTP_PORT=XXXX node http-server.js`
const port = process.env.HTTP_PORT || 7000;
const app = express();

// All of our routes (ie. endpoint + router)
const routes = require('./routes');

// TODO: add a logger
app.use(express.static('dist'));

// `routes` is an object of { endpoint: router, ... }
Object.entries(routes).forEach((entry) => {
  const [endpoint, router] = entry;
  app.use(endpoint, router);
});

// Captures all routes which hasn't been defined
app.use((req, res) => {
  const dir = path.resolve(__dirname, 'src');
  res.sendFile(`${dir}/index.html`);
});

app.listen(port, () => {
  console.log(`[HTTP]: Started listening on port :${port}`);
});
