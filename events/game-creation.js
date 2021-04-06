const utils = require('../utils');
const calc = require('../calculator');

// TODO: A player shouldnt be able to start a game if they're already inside of
// one
function gameCreate(context, payload) {
  // Game name, number of teams and stations
  const name = payload.name || '';
  const nrOfTeams = payload.nrOfTeams || 4;
  const nrOfStations = payload.nrOfStations || 6;
  const defaults = {};

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
  // Add our own username to our player
  const { username } = context.getPlayerState();
  // And then add ourselves as the first player
  players[id] = utils.createPlayer({ username });

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

  // TODO: check to see that everyone is within a team

  const planDuration = game.properties.planPhaseDuration * 1000;

  // TODO: break into serparate functions (plan + play phases)
  // After our plan phase (1) we'll start the play phase (2)
  setTimeout(() => {
    const game = context.getGameState();
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

      // Calculate scores and salaries
      const salary = calc.getTeamSalaries(game);
      // For each of the "next salary" we'll add it to the teams score
      Object.entries(salary).forEach((entry) => {
        const [team, nextSalary] = entry;
        game.teams[team].properties.score += nextSalary;
      });

      // Update the game state (currentTick + callbacks)
      context.updateGameState(game);

      // Get the current scores
      const score = calc.getCurrTeamScores(game);

      // Stop our running interval when we've gone through all of the salaries
      if (game.currentTick >= game.properties.nrOfSalaries) {
        clearInterval(interval);
        // Set our current game phase to 3 (Game Over)
        // ===========================================
        game.properties.phase = { type: 3 };
        context.updateGameState(game);
        // Broadcast the last phase
        context.broadcastToGame('game:phase', game.properties.phase);
        context.broadcastToGame('game:score', { score });
        context.broadcastToGame('game:salary', { salary });
        return;
      }

      // Broadcast the salary event (should contain the score of all teams)
      context.broadcastToGame('game:score', { score });
      context.broadcastToGame('game:salary', { salary });
    }, tickDuration);

    // Calculate scores and salaries
    // NOTE: this will always be 0 and no upcoming salary (ie. the first time)
    const initialScore = calc.getCurrTeamScores(game);
    const initialSalary = calc.getTeamSalaries(game);

    // Set our current game phase to 2 (Play)
    // ======================================
    const start = Date.now();
    const duration = game.properties.playPhaseDuration * 1000;
    game.properties.phase = { type: 2, start, duration };
    context.updateGameState(game);
    // Broadcast the second phase
    context.broadcastToGame('game:phase', game.properties.phase);
    context.broadcastToGame('game:score', { score: initialScore });
    context.broadcastToGame('game:salary', { salary: initialSalary });
  }, planDuration);

  // Set our current game phase to 1 (Plan)
  // ======================================
  const start = Date.now();
  game.properties.phase = { type: 1, start, duration: planDuration };
  context.updateGameState(game);
  // Broadcast the first phase
  context.broadcastToGame('game:phase', game.properties.phase);
}

// TODO: add delete game
module.exports = {
  'game:create': gameCreate,
  'game:start': gameStart,
};
