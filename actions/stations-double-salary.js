function doubleSalary(context) {
  // First we'll get the game state
  const game = context.getGameState();

  // Some error-handling
  // We're not in a game
  if (game === null) {
    context.send('spell:stations:double-salary:fail', { errorCode: 0 });
    return false;
  }
  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('spell:stations:double-salary:fail', { errorCode: 1 });
    return false;
  }

  // Loop through all stations in the gamestate and change their salaryMultiplier
  game.stations.forEach((station) => {
    station.properties.salaryMultiplier = 2;
  });

  // 30 seconds
  const duration = 30 * 1000;

  // Update the gamestate
  context.updateGameState(game);

  // Broadcast the event to everyone
  context.broadcastToGame('stations:double-salary', { duration });

  // Reset all multipliers after the next salaries have been given
  context.setTimeout(() => {
    const game = context.getGameState();
    game.stations.forEach((station) => {
      station.properties.salaryMultiplier = 1;
    });
    context.updateGameState(game);
    context.broadcastToGame('stations:double-salary:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'spell:stations:double-salary': doubleSalary,
};