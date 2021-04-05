/* eslint-disable linebreak-style */

function getToken(context, payload) {
  // payload=token-index that gets sent
  // check the game phase, only when in play phase
  const gameState = context.getGameState();

  // there is no game
  if (gameState === null) {
    context.send('spell:player:get-token:fail', { errorCode: 0 });
    return;
  }

  const gamePhase = gameState.properties.phase.type;

  // not in the play phase
  if (gamePhase !== 2) {
    context.send('spell:player:get-token:fail', { errorCode: 1 });
    return;
  }

  // checks if the token-index from payload is within the predefined tokens-arr of the game
  // if the index of the chosen token is outside the arraylength, an invalid index has been sent
  if (payload.token > gameState.tokens.length) {
    return;
  }

  // get the player and information about the player
  // connectedPlayer is an object with the keys id, connectedAt & gameId
  let connectedPlayer = context.getPlayerState();

  // we search the player within the current game and change the token
  gameState.players[connectedPlayer.id].defaults.pocket = payload.token;

  // save the changes
  context.updateGameState(gameState);

  // send back message to the player with the event and token as payload
  context.sendTo('player:get-token', { token: payload.token });
}

module.exports = {
  'spell:player:get-token': getToken,
};
