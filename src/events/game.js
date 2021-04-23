function gameYours(context, payload) {
  context.setState(payload);
}

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

function gamePhase(context, payload) {
  const { game } = context.getState();

  if (!game) {
    return;
  }

  // Update the game with the current phase
  game.phase = payload;
  context.setState({ game });
}

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
