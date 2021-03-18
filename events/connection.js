function playerConnect() {
  // TBD
}

// Whenever a player disconnects
function playerDisconnect(context) {
  const player = context.getPlayerState();
  const properties = Object.keys(player);

  // We'll remove a connected player if they only have 2 properties or less,
  // which means if they only connected and never logged in we'll remove them if
  // they disconnect
  if (properties.length <= 2) {
    context.removePlayer(player.id);
  } else {
    // Otherwise we'll set their online status to false
    context.updatePlayerState({ online: false });
  }
}

// Whenever a player wants to reconnect (by a username)
function playerReconnect(context, payload) {
  const { username } = payload;
  // We'll try to fetch the player with `username`
  const player = context.getPlayerState({ username });

  // If the player exists
  if (player !== null) {
    // We'll assign this connection to the player (since they reconnected)
    context.connectToPlayer(player.id);
  }

  // Set the online status to true
  context.updatePlayerState({ online: true });
  // Get the current game state
  const game = context.getGameState();
  // And send both the player and game info to the connected client
  context.send('player:info', player);
  context.send('game:info', game);
}

module.exports = {
  'player:connect': playerConnect,
  'player:disconnect': playerDisconnect,
  'player:reconnect': playerReconnect,
};
