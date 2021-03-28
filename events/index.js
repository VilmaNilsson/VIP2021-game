// This is where we `require` all of our event handlers ('event:name': handler)
const debug = require('./debug');
const connection = require('./connection');
const gameCreation = require('./game-creation.js');
const spells = require('./spells');

// And then combine them into one object
module.exports = {
  debug,
  connection,
  gameCreation,
  spells,
};
