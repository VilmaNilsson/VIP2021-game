function teamHaste(context, payload) {
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

  // Get the player's id
  const playerId = context.id();
  // Get the player's object so that we can get their team
  const player = game.players[playerId];
  const team = player.team;

  // Team doesnt exist
  if (game.teams[team] === undefined) {
    return { errorCode: 3 };
  }

  game.teams[team].properties.loginMultiplier = 0.5;

  context.updateGameState(game);
  context.broadcastToGame('action:team:haste', { team, start, duration });

  context.setTimeout(() => {
    const game = context.getGameState();
    game.teams[team].properties.loginMultiplier = game.teams[team].defaults.loginMultiplier;
    context.updateGameState(game);
    context.broadcastToGame('action:teams:haste:faded');
  }, duration);

  return true;
}

module.exports = {
  'action:team:haste': teamHaste,
};

