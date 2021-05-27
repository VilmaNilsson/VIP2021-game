/* eslint-disable linebreak-style */

function givePlayerToken(context, payload) {
  // payload=token-index that gets sent
  // check the game phase, only when in play phase
  const gameState = context.getGameState();

  // there is no game
  if (gameState === null) {
    context.send('action:player:token:fail', { errorCode: 0 });
    return false;
  }

  const gamePhase = gameState.properties.phase.type;

  // not in the play phase
  if (gamePhase !== 2) {
    context.send('action:player:token:fail', { errorCode: 1 });
    return false;
  }

  // checks if the token-index from payload is within the predefined tokens-arr of the game
  // if the index of the chosen token is outside the arraylength, an invalid index has been sent
  if (payload.token > gameState.tokens.length) {
    return false;
  }

  // get the player and information about the player
  // connectedPlayer is an object with the keys id, connectedAt & gameId
  const playerId = context.id();

  // we search the player within the current game and change the token
  gameState.players[playerId].properties.pocket = payload.token;

  // save the changes
  context.updateGameState(gameState);

  // send back message to the player with the event and token as payload
  context.send('player:cargos', { token: payload.token });

  return true;
}

module.exports = {
  'action:player:token': givePlayerToken,
};
