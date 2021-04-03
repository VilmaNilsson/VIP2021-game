// This is where we `require` all of our event handlers ('event:name': handler)
const debug = require('./debug');
const connection = require('./connection');
const gameLeave = require('./gameLeave.js');
const gameCreation = require('./game-creation');
const spells = require('./spells');
const playerJoinGame = require('./player-join-game');
const stationLogin = require('./station-login.js');
const playerLogin = require('./playerLogin');
const teamJoin = require('./teamJoin');
const teamLeave = require('./teamLeave.js');

// And then combine them into one object
module.exports = {
  debug,
  connection,
  gameCreation,
  gameLeave,
  spells,
  playerJoinGame,
  stationLogin,
  playerLogin,
  teamJoin,
  teamLeave,
};
