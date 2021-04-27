/* eslint-disable linebreak-style */
function unlockStationSpell(context, payload) {
  // check the game phase, only when in play phase
  const gameState = context.getGameState();

  // console.log(gameState.properties.phase.type);

  // there is no game
  if (gameState === null) {
    context.send('spell:unlock:station:fail', { errorCode: 0 });
    return false;
  }

  const gamePhase = gameState.properties.phase.type;

  // not in the play phase
  if (gamePhase !== 2) {
    context.send('spell:unlock:station:fail', { errorCode: 1 });
    return false;
  }

  // in the payload, the player sends information which station to lock
  const stationIndex = payload.station;
  // get the station from the gameState
  const station = gameState.stations[stationIndex];
  // the station does not exist
  if (station === undefined) {
    context.send('spell:unlock:station:fail', { errorCode: 2 });
    return false;
  }

  // check if the station is locked
  // if the station is not locked, it cant be unlocked
  // send back info that the station cant get unlocked
  if (station.properties.locked !== true) {
    // console.log("Heeeee, don't try to unlock an unlocked station... cheater!");
    return false;
  }

  // if the station is locked, change it in state and broadcast
  station.properties.locked = false;
  // insert the station after changing the key
  gameState.stations[stationIndex] = station;
  // save the changes
  context.updateGameState(gameState);
  // broadcast
  context.broadcastToGame('station:unlocked', { station: stationIndex });

  return true;
}

module.exports = {
  'spell:station:unlock': unlockStationSpell,
};
