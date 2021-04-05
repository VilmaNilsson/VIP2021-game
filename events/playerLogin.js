function playerLogin(context, payload) {
  const { username } = payload;
  context.updatePlayerState({ username });
  context.broadcast('player:login', { username });
  context.send('player:you', { username });
}

module.exports = {
  'player:login': playerLogin,
};
