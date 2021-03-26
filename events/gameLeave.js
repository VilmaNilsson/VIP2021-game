function gameLeave(context, payload) {

    // Get the game's ID
    const {gameID} = payload;

    // Get the game
    const game = context.getGameState({gameID});

    // Get the player's ID
    const playerID = context.id();

    // Filter away all players that aren't the one who is leaving
    let otherPlayers = game.players.filter(function(player) {
        return player != playerID;
    });

    // Put all other players in the game's player-array
    game.players = otherPlayers;

    // Uptade the game with the new player-array
    context.updateGameState(game, gameID);

    // Broadcast to all players in the affected game that one has left
    context.broadcastToGame('player:left', {playerID, name:''}, gameID);
}

module.exports = {
    'game:leave': gameLeave
}