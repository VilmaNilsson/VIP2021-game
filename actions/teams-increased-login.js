function increaseLoginTimeTeams(context, payload) {
  const DURATION = 60 * 1000;
  const game = context.getGameState();
  const { team } = payload;
  const LOGIN_MULTIPLIER = 1.5;
  const DEFAULT_LOGIN_TIME = game.teams[team].defaults.loginMultiplier;

  if (game === null) {
    context.send('action:teams:slowed:fail', { errorCode: 0 });
    return false;
  }
  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('action:teams:slowed:fail', { errorCode: 1 });
    return false;
  }

  if (!team) context.send('action:teams:slowed:fail', { errorCode: 2 });

  game.teams[team].properties.loginMultiplier *= LOGIN_MULTIPLIER;

  const newGameState = { ...game };
  context.updateGameState(newGameState);

  context.broadcastToGame('action:teams:slowed', { team });

  context.setTimeout(() => {
    game.teams[team].properties.loginMultiplier = DEFAULT_LOGIN_TIME;
    const newGameState = { ...game };

    context.updateGameState(newGameState);
    context.broadcastToGame('action:teams:slowed:faded');
  }, DURATION);

  return true;
}

module.exports = {
  'action:teams:slowed': increaseLoginTimeTeams,
};
