const utils = require('../utils');
const spells = require('../spells');

// Event handler that creates a new game
function gameCreate(context, payload) {
  const {
    name,
    nrOfTeams,
    nrOfStations,
    planDuration,
    playDuration
  } = payload;

  // A game must have a name
  if (name === undefined || typeof name !== 'string' || name === '') {
    context.send('game:create:fail', { errorCode: 0 });
    return;
  }

  const player = context.getPlayerState();

  // Can't start a game if you're in one
  if (player.gameId !== null) {
    context.send('game:create:fail', { errorCode: 1 });
    return;
  }

  // Default game play properties
  const defaults = {};

  if (planDuration !== undefined) {
    defaults.planPhaseDuration = planDuration;
  }

  if (playDuration !== undefined) {
    defaults.playPhaseDuration = playDuration;
  }

  // Our tokes (for now) is just a simple array of { name: letter }
  // for now it dosnt take any arguments
  const tokens = utils.createTokens();

  // Our teams (based off of `nrOfTeams`)
  const teams = Array.from({ length: nrOfTeams || 4 }).map((_, index) => {
    return utils.createTeam({
      name: `Team ${index + 1}`,
    });
  });

  // Randomized array of station names
  const stationNames = utils.getStationNames();

  // Our stations (based off of `nrOfStations`), the racks are based on the
  // number of teams and tokens
  const stations = Array.from({ length: nrOfStations || 6 }).map((_, index) => {
    const racks = utils.createRacks(teams.length, tokens.length);

    return utils.createStation({
      name: stationNames[index],
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
    defaults,
  });

  // Add the newly created game to the server state
  context.addGame(newGame.id, newGame);
  // Lets assign ourselves to the game
  context.updatePlayerState({ gameId: newGame.id });

  // Lets send back the newly created game
  const game = utils.filterGame(newGame);
  context.send('game:yours', { game });
}

function endPlayPhase(context) {
  const game = context.getGameState();
  const start = Date.now();
  const score = utils.getTeamScores(game);

  context.clearTimeouts();

  // Set our current game phase to 3 (End)
  // ======================================
  game.properties.phase = { type: 3, start };
  context.updateGameState(game);
  // Broadcast the last phase
  context.broadcastToGame('game:phase', game.properties.phase);
  context.broadcastToGame('game:score', { score });
}

function startPlayPhase(context) {
  const game = context.getGameState();
  const start = Date.now();
  const duration = game.properties.playPhaseDuration * 1000;

  setTimeout(() => endPlayPhase(context), duration);
  
  // Calculate scores and salaries
  const initialScore = utils.getTeamScores(game);

  // Set our current game phase to 2 (Play)
  // ======================================
  game.properties.phase = { type: 2, start, duration };
  context.updateGameState(game);
  // Broadcast the second phase
  context.broadcastToGame('game:phase', game.properties.phase);
  context.broadcastToGame('game:score', { score: initialScore });
}

// Event handler that starts an existing game
function gameStart(context) {
  const game = context.getGameState();

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

  // Make sure all players has joined a team
  if (Object.values(game.players).some((player) => player.team === -1)) {
    context.send('game:start:fail', { errorCode: 3 });
    return;
  }

  const planDuration = game.properties.planPhaseDuration * 1000;

  // Start the play phase after the plan phase
  setTimeout(() => startPlayPhase(context), planDuration);

  // Set our current game phase to 1 (Plan)
  // ======================================
  const start = Date.now();
  game.properties.phase = {
    type: 1,
    start,
    duration: planDuration,
    spells: spells.spells,
  };
  context.updateGameState(game);
  // Broadcast the first phase
  context.broadcastToGame('game:phase', game.properties.phase);
}

// TODO: add delete game
module.exports = {
  'game:create': gameCreate,
  'game:start': gameStart,
};
