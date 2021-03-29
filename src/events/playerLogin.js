function playerLogin(context, payload) {
  const { username } = payload;
  context.updatePlayerState({ username });
  context.broadcast('player:login', { username });
}

export default {
  'player:login': playerLogin,
};
