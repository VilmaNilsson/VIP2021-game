// When we receive the whole game
function gameYours(context, payload) {
  context.setState(payload);
}

// When we join a game
function gameJoined(context, payload) {
  const { playerId, username } = payload;
  const state = context.getState();

  if (!state.game) {
    return;
  }

  const { game } = state;

  // Player is already within the state
  if (game.players[playerId] !== undefined) {
    return;
  }

  game.players[playerId] = { username, team: -1 };
  context.setState({ game });
}

// When game phases are updated
function gamePhase(context, payload) {
  const { game } = context.getState();

  if (!game) {
    return;
  }

  // Update the game with the current phase
  game.phase = payload;
  context.setState({ game });
}

// When the new game scores are published
function gameScore(context, payload) {
  const { score } = payload;
  const { game } = context.getState();

  if (!game) {
    return;
  }

  game.teams = game.teams.map((team, index) => {
    team.score = score[index];
    return team;
  });

  context.setState({ game });
}

// When a game ends or you leave one
function gameOver(context, payload) {
  context.setState({ player: null, game: null });
  context.clearTimers();
}

export default {
  'game:yours': gameYours,
  'game:joined': gameJoined,
  'game:phase': gamePhase,
  'game:score': gameScore,
  'game:over': gameOver,
};
