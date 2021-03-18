// Whenever a player logs in
function playerLogin(context, payload) {
  const { username } = payload;
  // Get a player by `username`
  const player = context.getPlayerState({ username });

  // The player already exists
  if (player !== null) {
    context.send('player:login:fail', { message: 'Username already exists' });
    return;
  }

  // Otherwise we'll update the current client with the username
  context.updatePlayerState({ username, online: true });
  // And send them the data (which means it was successful)
  context.send('player:login', { username });
}

module.exports = {
  'player:login': playerLogin,
};
