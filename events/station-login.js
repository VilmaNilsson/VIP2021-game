// A function in calculator.js is required in this event
const utils = require('../utils.js');

function stationLogin(context, payload) {
  // Unload the payload into a constant
  const stationIndex = payload.station;

  // Get the gamestate
  const game = context.getGameState();

  // Get the plyer's id
  const playerId = context.id();

  // Get the station- and playerobject so that we can get their attributes
  const station = game.stations[stationIndex];
  const player = game.players[playerId];

  // We're not in a game
  if (game === null) {
    context.send('event:station:login:fail', { errorCode: 0 });
    return;
  }

  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('event:station:login:fail', { errorCode: 1 });
    return;
  }

  // If the requested station didn't exist
  if (station === undefined) {
    context.send('event:station:login:fail', { errorCode: 2 });
    return;
  }

  // If the station is locked or the player is unable to do anything they
  // shouldn't be able to log into the station
  if (station.properties.locked === true || player.properties.locked === true) {
    context.send('event:station:login:fail', { errorCode: 3 });
    return;
  }

  // Clear the previous login timeout
  if (player.properties.inStation !== null
    && player.properties.inStation.loginTimeout !== undefined) {
    clearTimeout(player.properties.inStation.loginTimeout);
  }

  // Calculate the total login-time by calling a function in calculator.js
  const loginTime = utils.getLoginTime(game, playerId, stationIndex);

  // After the defined time the user is allowed into the station
  const loginTimeout = setTimeout(() => {
    const game = context.getGameState();
    const { racks } = game.stations[stationIndex];
    context.send('station:login:done', { station: stationIndex, racks });
  }, loginTime * 1000);

  // Create a timestamp for the start of the login
  const start = Date.now();

  // Change the player's inStation-property
  player.properties.inStation = {
    station: stationIndex,
    start,
    loginTime,
    loginTimeout,
  };

  game.players[playerId] = player;

  // Update the gamestate (which includes the player)
  context.updateGameState(game);

  // Send the login-wait-event to the user so that they start waiting
  const { racks } = station;
  context.send('station:login:wait', {
    station: stationIndex,
    racks,
    start,
    loginTime,
  });
}

module.exports = {
  'station:login': stationLogin,
};
