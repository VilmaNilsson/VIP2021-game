function halfSalaryStationSpell(context, payload) {
    // First we'll get the game state
    const game = context.getGameState();
  
    // We're not in a game
    if (game === null) {
      context.send('spell:station:half-salary:fail', { errorCode: 0 });
      return;
    }
  
    // We're not in the play phase
    if (game.properties.phase.type !== 2) {
      context.send('spell:station:half-salary:fail', { errorCode: 1 });
      return;
    }
  
    // In this spell we'll receive the station index (the one to get it's salary cut)
    const stationIndex = payload.station;
    // We'll extract the station
    const station = game.stations[stationIndex];
  
    // They tried targeting an unknown station
    if (station === undefined) {
      context.send('spell:station:half-salary:fail', { errorCode: 2 });
      return;
    }
  
    // We always use the `properties` key for changing values
    station.properties.salaryMultiplier = .5;
    // Then we'll insert the station once it has been modified
    game.stations[stationIndex] = station;
    // Save our changes
    context.updateGameState(game);
    // And broadcast it to all players
    context.broadcastToGame('station:half-salary', { station: stationIndex });

    // Reset the station's salary on the next salary payout (ie. Tick)
    context.onNextGameTick(() => {
        const game = context.getGameState();
        const stationIndex = payload.station;
        const station = game.stations[stationIndex];
        station.properties.salaryMultiplier = 1;
        game.stations[stationIndex] = station;
        context.updateGameState(game);
        context.broadcastToGame('station:regular-salary', { station: stationIndex });
    });
}

module.exports = {
  'spell:station:half-salary': lockStationSpell,
};
