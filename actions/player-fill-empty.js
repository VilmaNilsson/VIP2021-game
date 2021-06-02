/* eslint-disable linebreak-style */
const utils = require('../utils');

function fillEmpty(context) {
  const game = context.getGameState();
  // The correct phase
  const gamePhase = game.properties.phase.type;
  // The players id
  const playerId = context.id();
  // Get the player's object with information about fx team
  const player = game.players[playerId];
  // Get the players team
  const yourTeam = player.team;
  // The current planet
  const stationIndex = player.properties.inStation.station;
  const station = game.stations[stationIndex];

  // there is no game
  if (game === null) {
    return { errorCode: 0 };
  }

  // not in the play phase
  if (gamePhase !== 2) {
    return { errorCode: 1 };
  }

  // Fail if player is not landed on a planet
  if (station === null) {
    return { errorCode: 2 };
  }

  if (utils.isRackFull(station, yourTeam)) {
    return { errorCode: 3 };
  }

  // We want to give the rack in the active planet random tokens in empty slots
  // by replacing the whole rack..
  station.racks[yourTeam].slots = station.racks[yourTeam].slots.map((slot) => {
    // ..if there are an empty slot
    if (slot.token === -1) {
      // ..create a new random token for it
      slot.token = Math.floor(Math.random() * game.tokens.length);
      const newToken = slot.token;
      const newTokenObj = { token: newToken };
      return newTokenObj;
    }
    // If the slot is not empty - return it as it is
    return slot;
  });

  // Save the changes
  context.updateGameState(game);

  // send back message to logged players in planet with the event and station + racks as payload
  const playerIds = utils.getPlayersInStation(game, stationIndex);

  // Broadcast event to everyone within the station
  context.broadcastTo(playerIds, 'station:rack', {
    station: stationIndex, team: yourTeam, rack: station.racks[yourTeam], scored: false,
  });

  // check if action updates the score
  utils.checkActionForScore(context, game, station, yourTeam);

  return true;
}

module.exports = {
  'action:player:fill-empty': fillEmpty,
};
