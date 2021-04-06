const utils = require('../utils');

function resetAll(context) {
  const game = context.getGameState();

  // Some error handling I totally wrote myself
  // We're not in a game
  if (game === null) {
    context.send('spell:reset:all:fail', { errorCode: 0 });
    return;
  }

  // We're not in the play phase
  if (game.properties.phase.type !== 2) {
    context.send('spell:reset:all:fail', { errorCode: 1 });
    return;
  }

  const players = { ...game.players };
  const stations = [...game.stations];
  const nrOfPlayers = Object.keys(players).length;
  const nrOfTeams = game.teams.length;
  const nrOfTokens = game.tokens.length;

  // Empty out pocket(s)
  for (let i = 0; i < nrOfPlayers; i += 1) {
    players[i].pocket = -1;
    if (players[i].temporaryPocketLocked !== true) {
      players[i].temporaryPocket = -1;
    }
  }

  // Reset stations
  stations.forEach((station) => {
    // Emptying the racks-array to avoid doubles - is this neccessary?
    station.racks = [];
    station.racks = utils.createRacks(nrOfTeams, nrOfTokens);
  });

  // Update our game-state
  context.updateGameState(game);
  // Broadcast our stuff
  context.broadcastToGame('reset:pocket');
  context.broadcastToGame('reset:stations', { stations });
  context.broadcastToGame('game:salary');
}

module.export = {
  'spell:reset:all': resetAll,
};
