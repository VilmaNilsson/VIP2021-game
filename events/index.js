// This is where we `require` all of our event handlers ('event:name': handler)
const debug = require('./debug');
const connection = require('./connection');
const gameCreation = require('./game-creation');
const spells = require('./spells');
const playerJoinGame = require('./player-join-game');
const playerLogin = require ('./playerLogin');
const teamJoin = require ('./teamJoin');

// And then combine them into one object
module.exports = {
  debug,
  connection,
  gameCreation,
  spells,
  playerJoinGame,
  playerLogin,
  teamJoin,
};
