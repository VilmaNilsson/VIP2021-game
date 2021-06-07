const utils = require('../utils');

function swapTeamRack(context, payload) {
  // First, get the gamestate so that we can reach the neccesary attributes
  const game = context.getGameState();

  // Index of what rack to be swapped for your own
  const { rack } = payload;

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

  // You're not in any station
  if (player.properties.inStation === null) {
    return { errorCode: 2 };
  }

  // The current station
  const station = player.properties.inStation.station;
  // Your team index
  const yourTeam = player.team;
  // Racks
  const yourRack = game.stations[station].racks[yourTeam];
  const otherRack = game.stations[station].racks[rack];
  // Swap racks
  game.stations[station].racks[yourTeam] = otherRack;
  game.stations[station].racks[rack] = yourRack;
  // Update the gamestate (which includes the racks)
  context.updateGameState(game);

  // Broadcast the event (to everyone within a station)
  const playerIds = utils.getPlayersInStation(game, station);
  // Two times since two racks get changed
  context.broadcastTo(playerIds, 'station:rack', { team: yourTeam, rack: otherRack });
  context.broadcastTo(playerIds, 'station:rack', { team: rack, rack: yourRack });

  return true;
}

module.exports = {
  'action:racks:swap': swapTeamRack,
};
