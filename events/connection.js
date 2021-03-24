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
    context.broadcastToGame('player:disconnect', { id: context.id() });
  }
}

function playerReconnect() {
  // TBD
}

module.exports = {
  'player:connect': playerConnect,
  'player:disconnect': playerDisconnect,
  'player:reconnect': playerReconnect,
};
