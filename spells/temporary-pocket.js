function activateTemporaryPocket(context) {
  const duration = 120 * 1000;
  const playerId = context.id();
  const { id, players } = context.getGameState();
  const game = context.getGameState();

  players[playerId].properties.temporaryPockedLocked = false;
  const newGameState = { ...game };
  context.updateGameState(newGameState);

  context.send('player:temporary-pocket', { duration });

  setTimeout(() => {
    players[playerId].properties.temporaryPockedLocked = true;
    const newGameState = { ...game };
    context.updateGameState(newGameState);
    context.send('player:temporary-pocket:faded', {});
  }, duration);
}

module.exports = {
  'spell:player:temporary-pocket': activateTemporaryPocket,
};
