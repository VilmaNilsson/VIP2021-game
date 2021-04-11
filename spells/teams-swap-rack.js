const utils = require('../utils');

function swapTeamRack(context, payload) {
  // First, get the gamestate so that we can reach the neccesary attributes
  const game = context.getGameState();

  // Unpack the payload
  const { station, team } = payload;

  // Change the name of the "team"-constant so that it is easier to understand
  const teamTwo = team;

  // Some error-checking
  // We're not in a game
  if (game === null) {
    context.send('spell:rack:swap:fail', { errorCode: 0 });
    return;
  }
  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('spell:rack:swap:fail', { errorCode: 1 });
    return;
  }
  // They tried targeting an unknown station
  if (game.stations[station] === undefined) {
    context.send('spell:rack:swap:fail', { errorCode: 2 });
    return;
  }

  // Get the player's id
  const playerId = context.id();

  // Get the player's object so that we can get their team
  const player = game.players[playerId];

  // Get the player's team's index
  const teamOne = player.team;

  // Get the opponent's rack
  const opponentRack = game.stations[station].racks[teamTwo];

  // Place the player's rack in a temporary variable
  const tempRack = game.stations[station].racks[teamOne];

  // Swap the player's rack
  game.stations[station].racks[teamOne] = opponentRack;

  // Swap the opponent's rack
  game.stations[station].racks[opponentRack] = tempRack;

  // Update the gamestate (which includes the racks)
  context.updateGameState(game);

  // Broadcast the event (to everyone within a station)
  const playerIds = utils.getPlayersInStation(game, station);
  const racks = game.stations[station].racks;
  context.broadcastTo(playerIds, 'station:rack', { station, racks });
}

module.exports = {
  'spell:rack:swap': swapTeamRack,
};
