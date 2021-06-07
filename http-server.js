const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const minify = require('express-minify');
const useragent = require('express-useragent');

// Set a default port unless invoked with `$ HTTP_PORT=XXXX node http-server.js`
const port = process.env.HTTP_PORT || 7000;
const app = express();

app.set('views', './src');
app.set('view engine', 'ejs');

// Middleware
app.use(minify());
app.use(express.static('dist'));
app.use('/assets', express.static('assets'));
app.use(morgan('combined'));
app.use(useragent.express());

app.get('/admin', (req, res) => {
  fs.readFile('statistics.json', (err, data) => {
    if (err) {
      res.render('stats', { stats: [] });
    } else {
      const stats = JSON.parse(data);
      res.render('stats', {
        stats: stats.map((stat) => {
          stat.score = stat.score.sort().reverse();
          return stat;
        }).reverse()
      });
    }
  });
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
