function doubleSalaryStationSpell(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();

  // We're not in a game
  if (game === null) {
    context.send('action:station:double-points:fail', { errorCode: 0 });
    return false;
  }

  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('action:station:double-points:fail', { errorCode: 1 });
    return false;
  }

  // In this spell we'll receive the station index (the one to get it's salary increased)
  const stationIndex = payload.station;
  // We'll extract the station
  const station = game.stations[stationIndex];

  const POINTS_MULTIPLIER = 2;
  const DEFAULT_MUILTIPLER = station.defaults.pointsMultiplier;

  // They tried targeting an unknown station
  if (station === undefined) {
    context.send('action:station:double-points:fail', { errorCode: 2 });
    return false;
  }

  // 30 seconds
  const duration = 30 * 1000;
  const start = Date.now();

  // We always use the `properties` key for changing values
  station.properties.salaryMultiplier = POINTS_MULTIPLIER;
  // Then we'll insert the station once it has been modified
  game.stations[stationIndex] = station;
  // Save our changes
  context.updateGameState(game);
  // And broadcast it to all players
  context.broadcastToGame('action:station:double-points', { station: stationIndex, start, duration });

  // Reset the station's salary on the next salary payout (ie. Tick)
  context.setTimeout(() => {
    const game = context.getGameState();
    const stationIndex = payload.station;
    const station = game.stations[stationIndex];
    station.properties.salaryMultiplier = DEFAULT_MUILTIPLER;
    game.stations[stationIndex] = station;
    context.updateGameState(game);
    context.broadcastToGame('action:station:double-points:faded', { station: stationIndex });
  }, duration);

  return true;
}

module.exports = {
  'action:station:double-points': doubleSalaryStationSpell,
};
