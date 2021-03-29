function swapTeamRack(payload){
    // First, get the gamestate so that we can reach the neccesary attributes
    let game = context.getGameState();

    // Unpack the payload
    const {station, team} = payload;

    //Some error-checking
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
    let playerId = context.id();

    // Get the player's object so that we can get their team
    let player = game.players[playerId];

    // Get the player's team's index
    let playerTeamIndex = player.team;

    // Get the opponent's rack
    let opponentRack = game.stations[station].racks[team];

    // Place the player's rack in a temporary variable
    let tempRack = game.stations[station].racks[playerTeamIndex];

    // Swap the player's rack
    game.stations[station].racks[playerTeamIndex] = opponentRack;

    // Swap the opponent's rack
    game.stations[station].racks[opponentRack] = tempRack;

    // Update the gamestate (which includes the racks)
    context.updateGameState(game, game.id);

    // Broadcast the event
    context.broadcastToGame('rack:swap', {station, playerTeamIndex, team}, game.id);
}

module.exports = {
    'spell:rack:swap': swapTeamRack
  };