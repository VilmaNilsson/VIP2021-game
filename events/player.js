function playerLogin(context, payload) {
  const { username } = payload;
  context.updatePlayerState({ username });
  context.broadcast('player:login', { username });
}

// This just echoes back whatever it gets to the same client
function playerEcho(context, payload) {
  context.send('player:echo', payload);
}

module.exports = {
  'player:login': playerLogin,
  'player:echo': playerEcho,
};
