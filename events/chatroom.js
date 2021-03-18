// Whenever we receive a chat message
function chatMessage(context, payload) {
  // NOTE: We could also check so `game` and `player` isnt null as a safety
  // precaution
  const game = context.getGameState();
  const player = context.getPlayerState();

  const message = {
    time: Date.now(),
    text: payload.message,
    player: player.username,
  };

  // We'll append the message to the current chat history
  game.history = [...game.history, message];
  // And then update the game state with this
  context.updateGameState(game);
  // And then broadcast the message (to all within the same game as me)
  context.broadcastToGame('chat:message', message);
}

module.exports = {
  'chat:message': chatMessage,
};
