function activateTemporaryPocket(context) {
  const start = Date.now();
  const duration = 120 * 1000;
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];

  // Already unlocked
  if (player.properties.temporaryPocketLocked === false) {
    context.send('player:temporary-pocket:fail', { errorCode: 1 });
    return;
  }

  player.properties.temporaryPocketLocked = false;
  game.players[playerId] = player;
  context.updateGameState(game);

  context.send('player:temporary-pocket', { start, duration });

  context.setTimeout(() => {
    const playerId = context.id();
    const game = context.getGameState();
    const player = game.players[playerId];
    player.properties.temporaryPocketLocked = true;
    game.players[playerId] = player;
    context.updateGameState(game);
    context.send('player:temporary-pocket:faded', {});
  }, duration);

  return true;
}

module.exports = {
  'spell:player:temporary-pocket': activateTemporaryPocket,
};
