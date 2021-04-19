function playerConnect() {
  // TBD
}

// Whenever a player disconnects
function playerDisconnect(context) {
  const player = context.getPlayerState();

  // We'll remove a connected player if they only have 2 properties or less,
  // which means if they only connected and never logged in we'll remove them if
  // they disconnect
  if (player === null) {
    context.removePlayer(player.id);
    return;
  }

  if (properties.length <= 2) {
    const properties = Object.keys(player);
    return;
  }

  // Otherwise we'll set their online status to false
  context.updatePlayerState({ online: false });
  context.broadcastToGame('player:disconnect', { id: context.id() });
}

function playerReconnect() {
  // TBD
}

module.exports = {
  'player:connect': playerConnect,
  'player:disconnect': playerDisconnect,
  'player:reconnect': playerReconnect,
};
