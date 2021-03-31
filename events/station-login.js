function stationLogin(event, payload){

    // Unload the payload into a constant
    const {station} = payload;

    // Get the gamestate
    const game = context.getGameState();

    // Get the station- and playerobject so that we can get their attributes
    const stationObj = game.stations[station];
    const player = game.players[context.id()];

    //Some error checking
    // We're not in a game
    if (game === null) {
        context.send('event:station:login:fail', { errorCode: 0 });
        return;
      }
    // We're not in the play phase
    if (game.properties.phase.type !== 2) {
    context.send('event:station:login:fail', { errorCode: 1 });
    return;
    }
    // If the station is locked or the player is unable to do anything they shouldn't be able to log into the station
    if (stationObj.properties.locked == true || player.properties.locked == true) {
        context.send('event:station:login:fail', {errorCode: 2});
        return;
    }

    // Calculate the total login-time
    const loginTime = ((stationObj.properties.loginTime * stationObj.properties.loginMultiplier) * player.properties.loginTimeMultiplier);

    // Create a timestamp for the start of the login
    const date = new Date();
    const start = date.getTime();

    // Change the player's inStation-property
    game.players[context.id()].properties.inStation = {station, start, loginTime};

    // Update the gamestate (which includes the player)
    context.updateGameState(game);

    // Send the login-wait-event to the user so that they start waiting
    context.send('station:login:wait', {station, loginTime});

    // After the defined time the user is allowed into the station
    setTimeout(function() {
        const game = context.getGameState();
        context.send('station:login:done', {station, racks: game.stations[station].racks});
    }, loginTime * 1000);
}

module.exports = {
    'station:login': stationLogin,
}