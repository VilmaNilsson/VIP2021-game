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
    context.send('station:login:fail', { errorCode: 0 });
    return;
  }

  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('station:login:fail', { errorCode: 1 });
    return;
  }

  // If the requested station didn't exist
  if (station === undefined) {
    context.send('station:login:fail', { errorCode: 2 });
    return;
  }

  // If the station is locked or the player is unable to do anything they
  // shouldn't be able to log into the station
  if (station.properties.locked === true || player.properties.locked === true) {
    context.send('station:login:fail', { errorCode: 3 });
    return;
  }

  // Clear the previous login timeout
  if (player.properties.inStation !== null
    && player.properties.inStation.timeout !== undefined) {
    // `timeout` is the ID of an actual timeout
    context.clearTimeout(player.properties.inStation.timeout);
  }

  // Calculate the total login-time by calling a function in calculator.js
  const duration = utils.getLoginTime(game, playerId, stationIndex) * 1000;

  // After the defined time the user is allowed into the station
  const timeout = context.setTimeout(() => {
    const game = context.getGameState();
    const { racks } = game.stations[stationIndex];
    context.send('station:login:done', { station: stationIndex, racks });
  }, duration);

  // Create a timestamp for the start of the login
  const start = Date.now();

  // Change the player's inStation-property
  player.properties.inStation = {
    station: stationIndex,
    start,
    duration,
    timeout,
  };

  game.players[playerId] = player;

  // Update the gamestate (which includes the player)
  context.updateGameState(game);

  const { racks } = station;
  // Send the login-wait-event to the user so that they start waiting
  context.send('station:login:wait', {
    station: stationIndex,
    racks,
    start,
    duration,
  });
}

module.exports = {
  'station:login': stationLogin,
};
