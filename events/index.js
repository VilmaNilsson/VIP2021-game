// This is where we `require` all of our event handlers ('event:name': handler)
const debug = require('./debug');
const connection = require('./connection');
const player = require('./player');

// And then combine them into one object
module.exports = {
  debug,
  connection,
  player,
};
