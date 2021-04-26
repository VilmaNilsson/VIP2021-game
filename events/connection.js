const utils = require('../utils');

function playerConnect() {
  // TBD
}

// Whenever a player disconnects
function playerDisconnect(context) {
  const player = context.getPlayerState();

  // If no socket is connected, dont do anything
  if (player === null) {
    return;
  }

  // We'll remove a connected player if they only have 2 properties or less,
  // which means if they only connected and never logged in we'll remove them if
  // they disconnect
  const properties = Object.keys(player);

  if (properties.length <= 2) {
    context.removePlayer(player.id);
    return;
  }

  // Otherwise we'll set their online status to false
  context.updatePlayerState({ online: false });
  context.broadcastToGame('player:disconnect', { id: context.id() });
}

// Handles player reconnects
function playerReconnect(context, payload) {
  const { id } = payload;
  const reconnected = context.connectToPlayer(id);

  // We first try to connect this new WebSocket ID with an old player
  if (!reconnected) {
    return;
  }

  const game = context.getGameState();

  if (game === null) {
    return;
  }

  const player = game.players[id];

  // If they're inside of a game and in a station
  if (player.properties.inStation !== null) {
    const racks = game.stations[player.properties.inStation.station].racks;

    // We'll send the game, player and racks
    context.send('player:reconnect', {
      player: utils.filterPlayer(player),
      game: utils.filterGame(game),
      racks,
    });
  } else {
    // Otherwise no racks
    context.send('player:reconnect', {
      player: utils.filterPlayer(player),
      game: utils.filterGame(game),
    });
  }
}

module.exports = {
  'player:connect': playerConnect,
  'player:disconnect': playerDisconnect,
  'player:reconnect': playerReconnect,
};
