// This is where we `require` all of our routes
const stats = require('./stats');

// And then export them via `endpoint: router` pairs
module.exports = {
  '/stats': stats,
};
