function planetDoublePoints(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();

  // We're not in a game
  if (game === null) {
    return { errorCode: 0 };
  }

  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    return { errorCode: 1 };
  }

  // In this spell we'll receive the station index (the one to get it's salary increased)
  const stationIndex = payload.station;
  // We'll extract the station
  const station = game.stations[stationIndex];

  // They tried targeting an unknown station
  if (station === undefined) {
    return { errorCode: 2 };
  }

  // 30 seconds
  const duration = 30 * 1000;
  const start = Date.now();

  // Double the amount of points gained
  station.properties.pointsMultiplier = 2;
  // Then we'll insert the station once it has been modified
  game.stations[stationIndex] = station;
  // Save our changes
  context.updateGameState(game);
  // And broadcast it to all players
  context.broadcastToGame('action:station:x2', { station: stationIndex, start, duration });

  // Reset the station's salary on the next salary payout (ie. Tick)
  context.setTimeout(() => {
    const game = context.getGameState();
    const stationIndex = payload.station;
    const station = game.stations[stationIndex];
    station.properties.pointsMultiplier = station.defaults.pointsMultiplier;
    game.stations[stationIndex] = station;
    context.updateGameState(game);
    context.broadcastToGame('action:station:x2:faded', { station: stationIndex });
  }, duration);

  return true;
}

module.exports = {
  'action:station:x2': planetDoublePoints,
};
