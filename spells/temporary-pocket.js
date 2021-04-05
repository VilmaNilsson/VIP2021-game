function activateTemporaryPocket(context) {
  const duration = 120 * 1000;
  const playerId = context.id();
  const { id, players } = context.getGameState();
  const game = context.getGameState();

  players[playerId].properties.temporaryPockedLocked = false;
  const newGameState = { ...game };
  context.updateGameState(newGameState);

  context.send('player:activated:temporary-pocket', { duration });

  setTimeout(() => {
    players[playerId].properties.temporaryPockedLocked = true;
    const newGameState = { ...game };
    context.updateGameState(newGameState);
    context.send('player:locked:temporary-pocket', {});
  }, duration);
}

module.exports = {
  'spell:activate:temporary-pocket': activateTemporaryPocket,
};
