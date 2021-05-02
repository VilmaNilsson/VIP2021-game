function increasedLoginSpell(context, payload) {
  // state of the game
  const game = context.getGameState();

  // if we are on game
  if (game === null) {
    context.send('action:station:slow:fail', { errorCode: 0 });
    return false;
  }

  // if we are on the good game phase
  if (game.properties.phase.type !== 2) {
    context.send('action:station:slow:fail', { errorCode: 1 });
    return false;
  }

  // we receive the index of the selected station
  const stationIndex = payload.station;
  // we find the corresponding station
  const station = game.stations[stationIndex];

  // we check if the station exist
  if (station === undefined) {
    context.send('action:station:slow:fail', { errorCode: 2 });
    return false;
  }

  // we change the value of the loginTime variable
  station.properties.loginMultiplier = 1.5;
  // we send back the modified station
  game.stations[stationIndex] = station;
  // we save the change
  context.updateGameState(game);
  // we broadcast the change to all player
  context.broadcastToGame('action:station:slowed', { station: stationIndex, duration: 60 });

  // we reset the parameter after 1 mins
  context.setTimeout(() => {
    const game = context.getGameState();
    const stationIndex = payload.station;
    const station = game.stations[stationIndex];
    station.properties.loginMultiplier = 1;
    game.stations[stationIndex] = station;
    context.updateGameState(game);
    context.broadcastToGame('action:station:slowed:faded', { station: stationIndex });
  }, 60 * 1000);

  return true;
}

module.exports = {
  'action:station:slowed': increasedLoginSpell,
};
