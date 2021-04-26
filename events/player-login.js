function playerLogin(context, payload) {
  const { username } = payload;

  const playerExists = context.getPlayerState({ username });

  // If the username is taken
  if (playerExists) {
    context.send('player:login:fail', { errorCode: 0 });
    return;
  }

  const id = context.id();
  context.updatePlayerState({ username, gameId: null });
  context.send('player:you', { id, username });
}

module.exports = {
  'player:login': playerLogin,
};
