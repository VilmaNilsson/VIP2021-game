function playerLogin(context, payload) {
  const { username } = payload;
  context.updatePlayerState({ username });
  context.broadcast('player:login', { username });
}

module.exports = {
  'player:login': playerLogin,
};
