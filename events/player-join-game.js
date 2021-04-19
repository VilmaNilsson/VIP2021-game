const utils = require('../utils');

function playerJoinGame(context, payload) {
  const playerId = context.id();
  const player = context.getPlayerState();
  const { name } = payload;
  const game = context.getGameState({ name });

  // Checks if game exits
  if (game === null) {
    context.send('game:joined:fail', { errorCode: 0 });
    return;
  }

  // Game already started or ended
  if (game.properties.phase >= 2) {
    context.send('game:joined:fail', { errorCode: 1 });
    return;
  }

  const { username } = player;
  const newPlayer = utils.createPlayer({ username });
  game.players[playerId] = newPlayer;
  // Update the game with the new player
  context.updateGameState(game, game.id);

  // Connect the player to the game as well as adding them as a new player
  player.gameId = game.id;
  context.updatePlayerState(player);

  // Send the game and player back
  context.send('player:you', { player: utils.filterPlayer(newPlayer) });
  context.send('game:yours', { game: utils.filterGame(game) });
  // Let everyone know the player has joined
  context.broadcastToGame('game:joined', { playerId, username });
}

module.exports = {
  'game:join': playerJoinGame,
};
