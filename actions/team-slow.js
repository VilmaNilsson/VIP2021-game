function teamSlow(context, payload) {
  const game = context.getGameState();

  // We're not in a game
  if (game === null) {
    return { errorCode: 0 };
  }
  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    return { errorCode: 1 };
  }

  // 30 seconds
  const duration = 30 * 1000;
  const start = Date.now();

  const { team } = payload;

  // Invalid payload
  if (team === undefined || team > 4) {
    return { errorCode: 2 };
  }

  // Team doesnt exist
  if (game.teams[team] === undefined) {
    return { errorCode: 3 };
  }

  game.teams[team].properties.loginMultiplier = 1.5;

  context.updateGameState(game);
  context.broadcastToGame('action:team:slow', { team, start, duration });

  context.setTimeout(() => {
    const game = context.getGameState();
    game.teams[team].properties.loginMultiplier = game.teams[team].defaults.loginMultiplier;
    context.updateGameState(game);
    context.broadcastToGame('action:teams:slow:faded');
  }, duration);

  return true;
}

module.exports = {
  'action:team:slow': teamSlow,
};
