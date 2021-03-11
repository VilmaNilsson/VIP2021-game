// This is where we `require` all of our event handlers ('event:name': handler)
const connection = require('./connection');
const player = require('./player');

// And then combine them into one object
module.exports = {
  ...connection,
  ...player,
};
