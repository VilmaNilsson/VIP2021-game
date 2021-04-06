// This is where we `require` all of our event handlers ('event:name': handler)
const debug = require('./debug');
const connection = require('./connection');
const gameCreation = require('./game-creation');
const playerLeaveGame = require('./player-leave-game');
const playerJoinGame = require('./player-join-game');
const playerJoinTeam = require('./player-join-team');
const playerLeaveTeam = require('./player-leave-team');
const playerLogin = require('./player-login');
const stationLogin = require('./station-login');
const token = require('./token');

// And then combine them into one object
module.exports = {
  debug,
  connection,
  gameCreation,
  playerLeaveGame,
  playerJoinGame,
  playerJoinTeam,
  playerLeaveTeam,
  playerLogin,
  stationLogin,
  token,
};
