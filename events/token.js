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

  // The swap has to be from two separate places
  if (to === from) {
    context.send('token:swap:fail', { errorCode: 3 });
    return;
  }

  // If the destination (pocket to slot) has a token, we'll replace them
  //
  // from (string) 'pocket'
  // from (string) 'temporary-pocket'
  // from (int)    0 (slot index)           - station from player
  //
  // to (string)   'pocket'
  // to (string)   'temporary-pocket'
  // to (int)      3 (slot index)           - station from player
}

module.exports = {
  'token:swap': tokenSwap,
};
