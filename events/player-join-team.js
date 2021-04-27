function teamJoin(context, payload) {
  const playerId = context.id();
  const game = context.getGameState();

  if (game === null) {
    context.send('team:join:fail', { errorCode: 0 });
    return;
  }

  const player = game.players[playerId];

  const teamIndex = payload.team;
  const team = game.teams[teamIndex];

  // Team doesn't exist
  if (team === undefined) {
    context.send('team:join:fail', { errorCode: 1 });
    return;
  }

  // Update the player within the game
  player.team = teamIndex;
  game.players[playerId] = player
  context.updateGameState(game);

  // NOTE: we could've broadcasted what team they also left

  context.send('team:yours', { team: teamIndex });
  context.broadcastToGame('team:joined', {
    playerId,
    team: teamIndex,
    username: player.username,
  });
}

module.exports = {
  'team:join': teamJoin,
};
