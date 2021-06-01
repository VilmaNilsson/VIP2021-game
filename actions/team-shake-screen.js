function shakeScreen(context, payload) {
  const game = context.getGameState();

  if (game === null) {
    return { errorCode: 0 };
  }
  if (game.properties.phase.type !== 2) {
    return { errorCode: 1 };
  }

  const duration = 10 * 1000;
  const start = Date.now();
  const { team } = payload;

  const selectedTeam = game.teams[team];

  if (team === undefined || team > 4) {
    return { errorCode: 2 };
  }
  if (selectedTeam === undefined) {
    return { errorCode: 3 };
  }

  selectedTeam.properties.shaking = true;

  game.teams[team] = selectedTeam;
  context.updateGameState(game);

  context.broadcastToGame('action:team:shake', { team, start, duration });

  context.setTimeout(() => {
    delete selectedTeam.properties.shaking;

    game.teams[team] = selectedTeam;
    context.updateGameState(game);

    context.broadcastToGame('action:team:shake:fade', { team });
  }, duration);

  return true;
}

module.exports = {
  'action:team:shake': shakeScreen,
};
