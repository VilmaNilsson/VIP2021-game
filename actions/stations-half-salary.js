function halfSalaryAllStations(context) {
  const game = context.getGameState();

  game.stations.forEach((station) => {
    station.properties.salaryMultiplier = 0.5;
  });

  // 30 seconds
  const duration = 30 * 1000;

  context.updateGameState(game);
  context.broadcastToGame('stations:half-salary', { duration });

  context.setTimeout(() => {
    const game = context.getGameState();

    game.stations.forEach((station) => {
      const defaultMultiplier = station.defaults.salaryMultiplier;
      station.properties.salaryMultiplier = defaultMultiplier;
    });

    context.updateGameState(game);
    context.broadcastToGame('stations:half-salary:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'spell:stations:half-salary': halfSalaryAllStations,
};
