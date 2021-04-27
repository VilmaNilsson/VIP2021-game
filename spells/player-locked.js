// Locks a player that is targeted with a "locked spell" fx. annoy player

// Takes two params, context = object containing functions to operate on state,
// payload = data sent from client-side: player-id AND duration in sec for the spell
function lockPlayer(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();

  // In this spell we'll receive the player id (from frontend) (the player to be locked),
  // and the duration of spell
  // Payload.duration MUST be a number, not a string, to work in the setTimeout
  const { playerId, duration } = payload;

  // We'll extract the player from state.game
  const player = game.players[playerId];

  // They tried targeting an unknown player
  if (player === undefined) {
    context.send('spell:lock:player:fail', { errorCode: 0 });
    return;
  }

  // They tried targeting a player that is already locked
  if (player.properties.locked === true) {
    context.send('spell:lock:player:fail', { errorCode: 1 });
    return;
  }

  // We always use the `properties` key for changing values
  // We want to lock the player
  player.properties.locked = true;

  // Overwrite the player once it has been modified
  game.players[playerId] = player;

  // Save our changes, game is an object we want to merge in to gameState
  context.updateGameState(game);

  // Send info to client about status=locked
  context.sendTo(playerId, 'player:locked', { duration });

  // Now: we want to make this spell last for as many seconds const duration is,
  // then we want to reset whatever we just did.
  // Instead of writing the same code reversed,
  // could we maybe call the function unlockPlayer in unlock_player.js?
  context.setTimeout(() => {
    // We'll just do the reverse for resetting
    const game = context.getGameState();
    const player = game.players[playerId];
    player.properties.locked = false;
    game.players[playerId] = player;
    context.updateGameState(game);
    context.sendTo(playerId, 'player:locked:faded', {});
  }, duration * 1000); // Times are in milliseconds

  return true;
}

module.exports = {
  'spell:lock:player': lockPlayer,
};
