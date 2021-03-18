// This is where we `require` all of our event handlers ('event:name': handler)
const debug = require('./debug');
const connection = require('./connection');

// And then combine them into one object
module.exports = {
  debug,
  connection,
};
