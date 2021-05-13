function increaseLoginTimePlayer(context, payload) {
  const duration = 60 * 1000;
  const gameState = context.getGameState();
  const targetedPlayerId = payload.playerId;
  // Change to a correct value later on, this is just a set value to make a change in state
  const LOGIN_MULTIPLIER = 1.5;
  const DEFAULT_LOGIN_TIME = gameState.players[targetedPlayerId].default.loginTimeMultiplier;

  const start = Date.now();

  gameState.players[targetedPlayerId].properties.loginTimeMultiplier *= LOGIN_MULTIPLIER;

  const newGameState = { ...gameState };

  context.updateGameState(newGameState);
  context.sendTo(targetedPlayerId, 'player:slowed', { start, duration });

  context.setTimeout(() => {
    gameState.players[targetedPlayerId].properties.loginTimeMultiplier = DEFAULT_LOGIN_TIME;

    const newGameState = { ...gameState };

    context.updateGameState(newGameState);
    context.sendTo(targetedPlayerId, 'player:slowed:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'spell:player:slow': increaseLoginTimePlayer,
};
