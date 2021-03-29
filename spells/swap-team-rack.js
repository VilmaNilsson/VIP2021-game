function swapTeamRack(payload){

    // Unpack the values
    [station, team] = payload;

    // Get the player's id
    let playerId = context.id;

    // Get the player's state so that we can get their team
    let player = context.getPlayerState(playerId);

    // Get the player's team
    let playerTeam = player.team;

    // Get the gamestate so that we can reach the racks
    let gameState = context.getGameState();

    // Get the player's team's rack
    let playerRack = gameState.stations[station].racks[playerTeam];

    // Get the opponent's rack
    let opponentRack = gameState.stations[station].racks[team];

    // Place the player's rack in a temporary variable
    let tempRack = playerRack;

    // Swap the player's rack
    gameState.stations[station].racks[playerTeam] = opponentRack;

    // Swap the opponent's rack
    gameState.stations[station].racks[opponentRack] = tempRack;

    // Update the gamestate
    context.updateGameState(gameState, gameState.id);

    // Broadcast the event
    context.broadcastToGame('rack:swap', {station, playerTeam, team}, gameState.id);
}

module.exports = {swapTeamRack};