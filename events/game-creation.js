const utils = require('../utils');
const calc = require('../calculator');

// TODO: A player shouldnt be able to start a game if they're already inside of
// one
// TODO: Add plan and play durations (from the payload)
function gameCreate(context, payload) {
  // Game name, number of teams and stations
  const name = payload.name || '';
  const nrOfTeams = payload.nrOfTeams || 4;
  const nrOfStations = payload.nrOfStations || 6;

  // Our tokes (for now) is just a simple array of { name: letter }
  // for now it dosnt take any arguments
  const tokens = utils.createTokens();

  // Our teams (based off of `nrOfTeams`)
  const teams = Array.from({ length: nrOfTeams }).map((_, index) => {
    return utils.createTeam({
      name: `Team ${index + 1}`,
    });
  });

  // Our stations (based off of `nrOfStations`), the racks are based on the
  // number of teams and tokens
  const stations = Array.from({ length: nrOfStations }).map((_, index) => {
    const racks = utils.createRacks(teams.length, tokens.length);

    return utils.createStation({
      name: `Station ${index + 1}`,
      racks,
    });
  });

  // All players are stored within an object as `{ playerId: playerObject }`
  const players = {};
  // We'll grab our own ID
  const id = context.id();
  // And then add ourselves as the first player
  players[id] = utils.createPlayer();

  // We'll create a new game with all of the above
  const newGame = utils.createGame({
    name,
    admin: id, // since we created the game we'll be the admin
    tokens,
    stations,
    teams,
    players,
  });

  // Add the newly created game to the server state
  context.addGame(newGame.id, newGame);
  // Lets assign ourselves to the game
  context.updatePlayerState({ gameId: newGame.id });
  // Lets send back the newly created game
  context.send('game:created', newGame);
}

function gameStart(context, payload) {
  const game = context.getGameState();

  // These two properties are mainly used for testing purposes
  if (payload.planDuration !== undefined) {
    game.properties.planPhaseDuration = payload.planDuration;
  }
  if (payload.playDuration !== undefined) {
    game.properties.playPhaseDuration = payload.playDuration;
  }

  // No exists game, we can't start anything
  if (game === null) {
    context.send('game:start:fail', { errorCode: 0 });
    return;
  }

  // Only the admin (creator) can start the game
  if (game.admin !== context.id()) {
    context.send('game:start:fail', { errorCode: 1 });
    return;
  }

  // The game cannot be started when it is done
  if (game.properties.phase.type === 3) {
    context.send('game:start:fail', { errorCode: 2 });
    return;
  }

  const planDuration = game.properties.planPhaseDuration * 1000;

  // After our plan phase (1) we'll start the play phase (2)
  setTimeout(() => {
    // Calculate the duration between salaries
    const tickDuration = calc.getTickDuration(game);

    const interval = setInterval(() => {
      const game = context.getGameState();
      // Increment the tick counter
      game.currentTick += 1;

      const cbsLength = game.callbacks.length;
      // If someone has queued callbacks for the next game tick
      if (cbsLength > 0) {
        // Call all of them
        game.callbacks.forEach((cb) => cb());
        // Let the console know we're clearing them (and how many)
        console.log(`[WS]: Game (${game.id}) clearing callbacks [${cbsLength}]`);
        // And then clear them
        game.callbacks = [];
      }

      // Update the game state (currentTick + callbacks)
      context.updateGameState(game);

      // Stop our running interval when we've gone through all of the salaries
      if (game.currentTick >= game.properties.nrOfSalaries) {
        clearInterval(interval);
        // Set our current game phase to 3 (Game Over)
        // ===========================================
        game.properties.phase = { type: 3 };
        context.updateGameState(game);
        // Broadcast the last salary and phase
        context.broadcastToGame('game:salary', {});
        context.broadcastToGame('game:phase', game.properties.phase);
        return;
      }

      // Broadcast the salary event (should contain the score of all teams)
      context.broadcastToGame('game:salary', {});
    }, tickDuration);

    // Set our current game phase to 2 (Play)
    // ======================================
    const start = Date.now();
    game.properties.phase = { type: 2, start };
    context.updateGameState(game);
    context.broadcastToGame('game:phase', game.properties.phase);
  }, planDuration);

  // Set our current game phase to 1 (Plan)
  // ======================================
  const start = Date.now();
  game.properties.phase = { type: 1, start };
  context.updateGameState(game);
  context.broadcastToGame('game:phase', game.properties.phase);
}

module.exports = {
  'game:create': gameCreate,
  'game:start': gameStart,
};
