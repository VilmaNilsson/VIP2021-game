// All event handlers gets called with `context` and `payload`
function playerConnect(context, payload) {
  context.updatePlayerState({ online: true });
  context.send('player:connected', { message: 'Got it!' });
}

// If `payload` isn't used don't add it to the list of arguments
function playerDisconnect(context) {
  context.updatePlayerState({ online: false });
  const { username } = context.getPlayerState();
  context.broadcast('player:disconnect', { username });
}

function playerReconnect() {
  // TBD
}

module.exports = {
  'player:connect': playerConnect,
  'player:disconnect': playerDisconnect,
  'player:reconnect': playerReconnect,
};
