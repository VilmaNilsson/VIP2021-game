const utils = require('../utils');

function randomNewRack(context, payload) {
  const game = context.getGameState();

  // We're not in a game
  if (game === null) {
    return { errorCode: 0 };
  }

  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    return { errorCode: 1 };
  }

  // Get the player's id
  const playerId = context.id();
  // Get the player's object so that we can get their team
  const player = game.players[playerId];

  // You're not on a planet
  if (player.properties.inStation === null) {
    return { errorCode: 2 };
  }

  // The current station
  const station = player.properties.inStation.station;
  // Your team index
  const yourTeam = player.team;
  // The number of slots in a rack is needed for the createRack-function
  const yourRackLength = game.stations[station].racks[yourTeam].slots.length;

  // Randomize new rack
  const slots = utils.createRack(yourRackLength);
  const newRack = { slots };
  const playerIds = utils.getPlayersInStation(game, station);

  // Broadcast event to everyone within the station
  context.broadcastTo(playerIds, 'station:rack', { team: yourTeam, rack: newRack , scored: false });

  return true;
}

module.exports = {
  'action:player:randomize-new': randomNewRack,
}
