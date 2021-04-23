function teamJoined(context, payload) {
  const { playerId, team } = payload;
  const state = context.getState();

  if (!state.game) {
    return;
  }

  const { game } = state;

  if (game.players[playerId] === undefined) {
    return;
  }

  game.players[playerId].team = team;
  context.setState({ game });
}

function teamYours(context, payload) {
  const { team } = payload;
  const { player } = context.getState();

  if (!player) {
    return;
  }

  player.team = team;
  context.setState({ player });
}

export default {
  'team:joined': teamJoined,
  'team:yours': teamYours,
};
