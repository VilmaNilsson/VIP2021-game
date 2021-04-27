function gameLeave(context) {
  // Get the game
  const game = context.getGameState();

  // Do nothing
  if (game === null) {
    context.send('game:leave:fail', { errorCode: 0 });
    return;
  }

  // Get the player's ID
  const playerId = context.id();

  // Delete the player from the game's players-object
  delete game.players[playerId];

  // Uptade the game with the new player-object
  context.updateGameState(game);

  // You were the last one leaving, lets stop the game and remove it
  if (Object.keys(game.players).length === 0) {
    context.clearTimeouts();
    context.removeGame(game.id);
  } else {
    // Broadcast to all players in the affected game that one has left
    context.broadcastToGame('game:left', { playerId }, game.id);
  }

  // Get the player's state
  const player = context.getPlayerState();

  // Set the player's gameId to none since they aren't in a game
  player.gameId = null;

  // Update the player's state
  context.updatePlayerState(player);

  // Send an event to the player as well
  context.send('game:over', {});
}

module.exports = {
  'game:leave': gameLeave,
};
