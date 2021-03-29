function gameLeave(context, payload) {

    // Get the game
    const game = context.getGameState();

    if (game !== null) {
        // Get the player's ID
        const playerID = context.id();

        // Delete the player from the game's players-object
        delete game.players[playerID];

        // Uptade the game with the new player-object
        context.updateGameState(game);

        // Get the player's state
        const player = context.getPlayerState(playerID);

        // Set the player's gameId to none since they aren't in a game
        player.gameId = null;

        // Update the player's state
        context.updatePlayerState(player);

        // Broadcast to all players in the affected game that one has left
        context.broadcastToGame('player:left', {playerID, name:''}, gameID);
    }
}

module.exports = {
    'game:leave': gameLeave
}