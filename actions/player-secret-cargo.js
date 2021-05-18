function activateSecretCargo(context) {
  const start = Date.now();
  const duration = 122 * 1000;
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];

  // Already unlocked
  if (player.properties.secretCargo.locked === false) {
    context.send('action:player:secret-cargo:fail', { errorCode: 0 });
    return false;
  }

  player.properties.secretCargo.locked = false;
  player.properties.secretCargo.start = start;
  player.properties.secretCargo.duration = duration;
  game.players[playerId] = player;
  context.updateGameState(game);

  context.send('action:player:secret-cargo', { start, duration });

  context.setTimeout(() => {
    const playerId = context.id();
    const game = context.getGameState();
    const player = game.players[playerId];
    player.properties.secretCargo.locked = true;
    delete player.properties.secretCargo.start;
    delete player.properties.secretCargo.duration;
    game.players[playerId] = player;
    context.updateGameState(game);
    context.send('action:player:secret-cargo:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'action:player:secret-cargo': activateSecretCargo,
};
