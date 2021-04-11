function teamJoin(context, payload) {
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];

  const teamIndex = payload.team;
  const team = game.teams[teamIndex];

  // Team doesn't exist
  if (team === undefined) {
    context.send('team:join:failed', { errorCode: 0 });
  }

  // Update the player within the game
  player.team = teamIndex;
  game.players[playerId] = player
  context.updateGameState(game);

  context.broadcastToGame('team:joined', { playerId, team: teamIndex });
  context.send('team:yours', { team: teamIndex });
}

module.exports = {
  'team:join': teamJoin,
};
