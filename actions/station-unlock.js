/* eslint-disable linebreak-style */
function unlockStationSpell(context, payload) {
  // check the game phase, only when in play phase
  const game = context.getGameState();

  // there is no game
  if (game === null) {
    return { errorCode: 0 };
  }

  const gamePhase = game.properties.phase.type;

  // not in the play phase
  if (gamePhase !== 2) {
    return { errorCode: 1 };
  }

  // in the payload, the player sends information which station to lock
  const stationIndex = payload.station;
  // get the station from the game
  const station = game.stations[stationIndex];

  // the station does not exist
  if (station === undefined) {
    return { errorCode: 2 };
  }

  // Can't unlock stations that arent locked
  if (station.properties.locked === false) {
    return { errorCode: 3 };
  }

  // if the station is locked, change it in state and broadcast
  station.properties.locked = false;
  // insert the station after changing the key
  game.stations[stationIndex] = station;
  // save the changes
  context.updateGameState(game);
  // broadcast
  context.broadcastToGame('action:station:unlocked', { station: stationIndex });

  return true;
}

module.exports = {
  'action:station:unlock': unlockStationSpell,
};
