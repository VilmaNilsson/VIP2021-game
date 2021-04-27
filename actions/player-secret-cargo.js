function activateSecretCargo(context) {
  const start = Date.now();
  const duration = 120 * 1000;
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];

  // Already unlocked
  if (player.properties.secretCargo.locked === false) {
    context.send('action:player:secret-cargo:fail', { errorCode: 0 });
    return false;
  }

  player.properties.secretCargo.locked = false;
  game.players[playerId] = player;
  context.updateGameState(game);

  context.send('action:player:secret-cargo', { start, duration });

  context.setTimeout(() => {
    const playerId = context.id();
    const game = context.getGameState();
    const player = game.players[playerId];
    player.properties.secretCargo.locked = true;
    game.players[playerId] = player;
    context.updateGameState(game);
    context.send('action:player:secret-cargo:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'action:player:secret-cargo': activateSecretCargo,
};
