// A function in calculator.js is required in this event
const calc = require('../calculator.js');

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

  // Calculate the total login-time by calling a function in calculator.js
  const loginTime = calc.getLoginTime(game, playerId, stationIndex);

  // Create a timestamp for the start of the login
  const start = Date.now();

  // Change the player's inStation-property
  game.players[playerId].properties.inStation = {
    station: stationIndex,
    start,
    loginTime,
  };

  // Update the gamestate (which includes the player)
  context.updateGameState(game);

  // TODO: cancel when logging into more
  // TODO: people logging in should be able to see everything live
  // Send the login-wait-event to the user so that they start waiting
  const { racks } = station;
  context.send('station:login:wait', {
    station: stationIndex,
    racks,
    start,
    loginTime,
  });

  // After the defined time the user is allowed into the station
  setTimeout(() => {
    const game = context.getGameState();
    const { racks } = game.stations[stationIndex];
    context.send('station:login:done', { station: stationIndex, racks });
  }, loginTime * 1000);
}

module.exports = {
  'station:login': stationLogin,
};
