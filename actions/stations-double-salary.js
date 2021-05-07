function doubleSalary(context) {
  // First we'll get the game state
  const game = context.getGameState();
  console.log('hejsansaldmas');

  // Some error-handling
  // We're not in a game
  if (game === null) {
    context.send('action:stations:double-points:fail', { errorCode: 0 });
    return false;
  }
  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('action:stations:double-points:fail', { errorCode: 1 });
    return false;
  }

  const POINT_MULTIPLIER = 2;

  // Loop through all stations in the gamestate and change their salaryMultiplier
  game.stations.forEach((station) => {
    station.properties.pointsMultiplier = POINT_MULTIPLIER;
  });

  // 30 seconds
  const duration = 30 * 1000;
  const start = Date.now();

  // Update the gamestate
  context.updateGameState(game);

  // Broadcast the event to everyone
  context.broadcastToGame('action:stations:double-points', { start, duration });

  // Reset all multipliers after the next salaries have been given
  context.setTimeout(() => {
    game.stations.forEach((station) => {
      const DEFAULT_MUILTIPLER = station.defaults.pointsMultiplier;
      station.properties.pointsMultiplier = DEFAULT_MUILTIPLER;
    });
    context.updateGameState(game);
    context.broadcastToGame('action:stations:double-points:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'action:stations:double-points': doubleSalary,
};
