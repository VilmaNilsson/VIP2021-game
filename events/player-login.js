// TODO: check if the username is taken?
function playerLogin(context, payload) {
  const { username } = payload;
  context.updatePlayerState({ username, gameId: null });
  context.broadcast('player:login', { username });
  context.send('player:you', { username });
}

module.exports = {
  'player:login': playerLogin,
};
