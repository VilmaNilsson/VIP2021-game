function halfSalaryAllStations(context) {
  const game = context.getGameState();

  const HALF_MULTIPLIER = 0.5;

  game.stations.forEach((station) => {
    station.properties.pointsMultiplier *= HALF_MULTIPLIER;
  });

  // 30 seconds
  const duration = 30 * 1000;
  const start = Date.now();

  context.updateGameState(game);
  context.broadcastToGame('action:stations:half-points', { start, duration });

  context.setTimeout(() => {
    const game = context.getGameState();

    game.stations.forEach((station) => {
      const defaultMultiplier = station.defaults.pointsMultiplier;
      station.properties.pointsMultiplier = defaultMultiplier;
    });

    context.updateGameState(game);
    context.broadcastToGame('action:stations:half-points:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'action:stations:half-points': halfSalaryAllStations,
};
