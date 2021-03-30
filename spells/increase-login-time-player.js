function increaseLoginTimePlayer(context, payload) {
  const duration = 60 * 1000;
  // Change to a correct value later on, this is just a set value to make a change in state
  const LOGIN_MULTIPLIER = 1.5;
  const DEFAULT_LOGIN_TIME = 1;
  const targetedPlayerId = payload.playerId;
  const gameState = context.getGameState();

  gameState.players[targetedPlayerId].properties.loginTimeMultiplier *= LOGIN_MULTIPLIER;

  const newGameState = { ...gameState };

  context.updateGameState(newGameState);
  context.sendTo(targetedPlayerId, 'player:slowed', { duration });

  setTimeout(() => {
    gameState.players[targetedPlayerId].properties.loginTimeMultiplier = DEFAULT_LOGIN_TIME;

    const newGameState = { ...gameState };

    context.updateGameState(newGameState);
    context.sendTo(targetedPlayerId, 'player:slowed:faded', {});
  }, duration);
}

module.exports = {
  'spell:player:slow': increaseLoginTimePlayer,
};
