function activateTemporaryPocket(context) {
  const duration = 120 * 1000;
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];

  player.properties.temporaryPockedLocked = false;
  game.players[playerId] = player;
  context.updateGameState(game);

  context.send('player:temporary-pocket', { duration });

  setTimeout(() => {
    const playerId = context.id();
    const game = context.getGameState();
    const player = game.players[playerId];
    player.properties.temporaryPockedLocked = true;
    game.players[playerId] = player;
    context.updateGameState(game);
    context.send('player:temporary-pocket:faded', {});
  }, duration);
}

module.exports = {
  'spell:player:temporary-pocket': activateTemporaryPocket,
};
