function increasedLoginSpell(context, payload) {
	// state of the game
    const game = context.getGameState();
	
    // if we are on game
    if (game === null) {
      context.send('spell:station:increasedlogintime:fail', { errorCode: 0 });
      return;
    }
  
    // if we are on the good game phase
    if (game.properties.phase.type !== 2) {
      context.send('spell:station:increasedlogintime:fail', { errorCode: 1 });
      return;
    }
  
    // we receive the index of the selected station
    const stationIndex = payload.station;
    // we find the corresponding station
    const station = game.stations[stationIndex];
  
    // we check if the station exist
    if (station === undefined) {
      context.send('spell:station:increasedlogintime:fail', { errorCode: 2 });
      return;
    }
  
    // we change the value of the loginTime variable
    station.properties.loginMultiplier = 1.5;
    // we send back the modified station
    game.stations[stationIndex] = station;
    // we save the change
    context.updateGameState(game);
    // we broadcast the change to all player
    context.broadcastToGame('station:slowed', { station: stationIndex ,duration: 60});

    // we reset the parameter after 1 mins
	
	 setTimeout(() => {
	
	const game = context.getGameState();
    const stationIndex = payload.station;
    const station = game.stations[stationIndex];
	station.properties.loginMultiplier = 1;
    game.stations[stationIndex] = station;
    context.updateGameState(game);
    context.broadcastToGame('station:slowed:faded', { station: stationIndex });
	
  }, 60 * 1000); 
}
}

module.exports = {
  'spell:station:slow': increasedLoginSpell,
};