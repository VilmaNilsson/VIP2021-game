function planetsDoublePoints(context) {
  // First we'll get the game state
  const game = context.getGameState();

  // Some error-handling
  // We're not in a game
  if (game === null) {
    return { errorCode: 0 };
  }
  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    return { errorCode: 1 };
  }

  // Loop through all stations in the gamestate and change their salaryMultiplier
  game.stations.forEach((station) => {
    station.properties.pointsMultiplier = 2;
  });

  // 30 seconds
  const duration = 30 * 1000;
  const start = Date.now();

  // Update the gamestate
  context.updateGameState(game);

  // Broadcast the event to everyone
  context.broadcastToGame('action:stations:x2', { start, duration });

  // Reset all multipliers after the next salaries have been given
  context.setTimeout(() => {
    game.stations.forEach((station) => {
      station.properties.pointsMultiplier = station.defaults.pointsMultiplier;
    });

    context.updateGameState(game);
    context.broadcastToGame('action:stations:x2:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'action:stations:x2': planetsDoublePoints,
};
