function gameLeave(context) {
  // Get the game
  const game = context.getGameState();

  if (game !== null) {
    // Get the player's ID
    const playerId = context.id();

    // Delete the player from the game's players-object
    delete game.players[playerId];

    // Uptade the game with the new player-object
    context.updateGameState(game);

    // Get the player's state
    const player = context.getPlayerState(playerId);

    // Set the player's gameId to none since they aren't in a game
    player.gameId = null;

    // Update the player's state
    context.updatePlayerState(player);

    // Broadcast to all players in the affected game that one has left
    context.broadcastToGame('player:left', { playerId, name: '' });
  }
}

module.exports = {
  'game:leave': gameLeave,
};
