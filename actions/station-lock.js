// NOTE: the error checking (if-statements) are not necessary at the moment
// (since we're just creating the first version), they're just here to show you
// what we should most likely do in the future.
function lockStationAction(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();

  // We're not in a game
  if (game === null) {
    context.send('action:station:lock:fail', { errorCode: 0 });
    return false;
  }

  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('action:station:lock:fail', { errorCode: 1 });
    return false;
  }

  // In this action we'll receive the station index (the one to be locked)
  const stationIndex = payload.station;
  // We'll extract the station
  const station = game.stations[stationIndex];

  // They tried targeting an unknown station
  if (station === undefined) {
    context.send('action:station:lock:fail', { errorCode: 2 });
    return false;
  }

  // 30 seconds
  const duration = 30 * 1000;
  const start = Date.now();

  // We always use the `properties` key for changing values
  station.properties.locked = true;
  // Then we'll insert the station once it has been modified
  game.stations[stationIndex] = station;
  // Save our changes
  context.updateGameState(game);
  // And broadcast it to all players
  context.broadcastToGame('action:station:locked', { station: stationIndex, start, duration });

  // Unlock the station on the next salary payout (ie. Tick)
  context.setTimeout(() => {
    const game = context.getGameState();
    const station = game.stations[stationIndex];
    station.properties.locked = false;
    game.stations[stationIndex] = station;
    context.updateGameState(game);
    context.broadcastToGame('action:station:locked:faded', { station: stationIndex });
  }, duration);

  return true;
}

module.exports = {
  'action:station:lock': lockStationAction,
};
