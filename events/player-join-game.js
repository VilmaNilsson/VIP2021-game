const utils = require('../utils');

function playerJoinGame(context, payload) {
  const playerId = context.id();
  const player = context.getPlayerState();
  const { name } = payload;
  const game = context.getGameState({ name });

  // Checks if game exits
  if (game === undefined) {
    context.send('game:joined:failed', { errorCode: 0 });
    return;
  }

  // Game already started or ended
  if (game.properties.phase >= 2) {
    context.send('game:joined:failed', { errorCode: 1 });
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
  // The player is now connected to a game we dont need to specify a game id
  // TODO: Broadcast to _all other players_
  context.broadcastToGame('player:joined', { playerId, username });
  // TODO: filter out unecessary properties
  context.send('game:joined', { game });
  // TODO: Do we need to filter out any keys?
  context.send('player:you', { player: newPlayer });
}

module.exports = {
  'game:join': playerJoinGame,
};
