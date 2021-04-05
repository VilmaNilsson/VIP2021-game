function tokenSwap(context, payload) {
  const game = context.getGameState();

  // Not within a game
  if (game === null) {
    context.send('token:swap:fail', { errorCode: 0 });
    return;
  }

  // Game is not active
  if (game.properties.phase !== 2) {
    context.send('token:swap:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();
  const player = game.players[playerId];

  // Not within a station
  if (player.properties.inStation === null) {
    context.send('token:swap:fail', { errorCode: 2 });
    return;
  }

  const { to, from } = payload;

  // TODO: from: pocket, temp pocket, or rack+slot from curr station
  // TODO: to: pocket, temp pocket, or rack+slot of a station
}

module.exports = {
  'token:swap': tokenSwap
};
