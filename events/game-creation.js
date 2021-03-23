const utils = require('../utils');

function gameCreate(context, payload) {
  // TODO: Either the client sends us the number of teams & stations when the
  // game is created or they can add/remove later on.
  const { name } = payload;

  // NOTE: Temporary solution for tokens, an array of { name: 'A' }, etc.
  // This could come from `payload` as well.
  const tokens = 'ABCDEFGH'.split('').map((char) => {
    return { name: char };
  });

  // NOTE: Temporary solution for teams, an array of 4 teams.
  const teams = Array.from({ length: 4 }).map(utils.createTeam);

  // NOTE: Temporary solution for stations, an array of 6 stations.
  const stations = Array.from({ length: 6 }).map(() => {
    const racks = utils.createRacks(teams.length, tokens.length);
    return utils.createStation({ racks });
  });

  // List of players is done by storing them within an object
  const players = {};
  const id = context.id();
  // Lets add ourselves as the first player
  players[id] = utils.createPlayer();

  const newGame = utils.createGame({
    name,
    admin: id, // since we created the game we'll be the admin
    tokens,
    stations,
    teams,
    players,
  });

  // NOTE: temporarily set game time to 50 seconds
  newGame.properties.playPhaseDuration = 50;

  context.addGame(newGame.id, newGame);

  // Lets assign ourselves to the game
  context.updatePlayerState({ gameId: newGame.id });
  // Lets send back the newly created game
  context.send('game:created', newGame);
  // And let our client know which game we joined
  context.send('game:joined', { gameId: newGame.id });
}

function gameStart(context) {
  const game = context.getGameState();

  // No exists game, we can't start anything
  if (game === null) {
    context.send('game:start:fail', { errorCode: 0 });
    return;
  }

  // TODO: Check if we're the admin, otherwise we can't start the game

  // TODO: We could start the plan phase first, then run a setTimeout that will
  // then activate the play phase?

  // In milliseconds
  const playDuration = game.properties.playPhaseDuration * 1000;
  // Duration between salaries
  const salaryDuration = playDuration / game.properties.nrOfSalaries;

  let salaryCounter = 0;
  const intervalId = setInterval(() => {
    salaryCounter += 1;

    // If someone has queued callbacks for the next game tick
    if (game.callbacks.length > 0) {
      // Call all of them
      game.callbacks.forEach((cb) => cb());
      // And then clear them
      game.callbacks = [];
      context.updateGameState(game);
    }

    // Stop our running interval when we've gone through all of the salaries
    if (salaryCounter >= game.properties.nrOfSalaries) {
      clearInterval(intervalId);
      context.updateGameState({ gameOver: true });
      // Broadcast the last salary and 'game over'
      context.broadcastToGame('game:salary', {});
      context.broadcastToGame('game:over', {});
      return;
    }

    // Broadcast the salary event (should contain the score of all teams)
    context.broadcastToGame('game:salary', {});
  }, salaryDuration);

  // This means some other function could techincally stop our running game
  game.intervalId = intervalId;

  // Set our current game phase to 2 (Play)
  const start = Date.now();
  game.properties.phase = { type: 2, start };

  context.updateGameState(game);
  context.broadcastToGame('game:start', { start });
}

module.exports = {
  'game:create': gameCreate,
  'game:start': gameStart,
};
