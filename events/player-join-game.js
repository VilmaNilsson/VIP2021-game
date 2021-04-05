const Utils = require('../utils');

function checkIfGameExist(gameState) {
  let isGameExisting = false;

  if (gameState !== undefined) {
    isGameExisting = true;
  }

  return isGameExisting;
}

function playerJoinGame(context, payload) {
  const playerId = context.id();
  const { gameId, username } = payload;
  const gameState = context.getGameState(gameId);

  // Checks if game exits
  const gameExists = checkIfGameExist(gameState);

  if (gameExists) {
    const newPlayer = Utils.createPlayer();
    gameState.players[playerId] = newPlayer;

    // Creating a new game state with the new player
    const newGameState = { ...gameState };

    context.updateGameState(gameId, newGameState);
    context.broadcastToGame('player:joined', { playerId, username }, gameId);
    context.send('game:joined', { game: newGameState });
    context.send('player:you', { player: newPlayer });
  } else {
    context.send('game:joined:failed', { message: 'Unfortunatley, the game you were trying to join was not found.' });
  }
}

module.exports = {
  'game:join': playerJoinGame,
};
