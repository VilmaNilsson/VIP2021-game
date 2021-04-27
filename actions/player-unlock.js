// Unlocks a player that is targeted with a "locked spell" fx. annoy
// Takes two params, context = object containing functions to operate on state,
// payload = data sent from client-side, in this case player-id for the targeted player
function unlockPlayer(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();

  // In this spell we'll receive the player id (from frontend) (the player to be unlocked)
  const { playerId } = payload;

  // We'll extract the player from state.game
  const player = game.players[playerId];

  // They tried targeting an unknown player
  if (player === undefined) {
    context.send('spell:unlock:player:fail', { errorCode: 0 });
    return false;
  }

  // We always use the `properties` key for changing values
  // We want to unlock the player
  player.properties.locked = false;

  // Overwrite the player once it has been modified
  game.players[playerId] = player;

  // Save our changes, game is an object we want to merge in to gameState
  context.updateGameState(game);

  // Send a message to the targeted player
  context.sendTo(playerId, 'player:unlocked', { player: playerId });

  return true;
}

module.exports = {
  'spell:player:unlock': unlockPlayer,
};
