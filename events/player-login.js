// TODO: check if the username is taken?
function playerLogin(context, payload) {
  const { username } = payload;

  const playerExists = context.getPlayerState({ username });

  if (playerExists) {
    context.send('player:login:fail', { errorCode: 0 });
    return;
  }

  // NOTE: do others need this info?
  // context.broadcast('player:login', { username });

  const id = context.id();
  context.updatePlayerState({ username, gameId: null });
  context.send('player:you', { id, username });
}

module.exports = {
  'player:login': playerLogin,
};
