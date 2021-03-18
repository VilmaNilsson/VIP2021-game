const utils = require('../utils');

function gameCreate(context, payload) {
  const { name } = payload;
  const game = context.getGameState(name);

  // Game already exists
  if (game !== null) {
    context.send('game:create:fail', { message: 'Game name already exists' });
    return;
  }

  const player = context.getPlayerState();

  // 4 digit + letter code
  const code = utils.randomHex();

  // Base object for new games (chatrooms)
  const newGame = {
    name,
    code,
    history: [],
    players: [
      { id: player.id, username: player.username },
    ],
  };
  // We'll add the game to our server state
  context.addGame(name, newGame);
  // Then we'll associate the current player with this game
  context.updatePlayerState({ gameId: name });
  // And send it to the player
  context.send(
    'game:create',
    { name: newGame.name, history: newGame.history, code: newGame.code },
  );
}

function gameJoin(context, payload) {
  const { code } = payload;
  // Get a game by `code`
  const game = context.getGameState({ code });

  // Game with `code` doesnt exist
  if (game === null) {
    context.send('game:join:fail', { message: 'Game not found' });
    return;
  }

  // Get the current player and update the gameId
  const player = context.getPlayerState();
  context.updatePlayerState({ gameId: game.name });
  // The new player being added to the list of players for a game
  const newPlayer = { id: player.id, username: player.username };
  // Add the player and then update the game state
  game.players = [...game.players, newPlayer];
  context.updateGameState(game);
  // Send the game info to the connected client
  context.send('game:info', { name: game.name, history: game.history });
  // And then broadcast the `join` event to all others in the game
  context.broadcastToGame('game:join', newPlayer);
}

module.exports = {
  'game:create': gameCreate,
  'game:join': gameJoin,
};
