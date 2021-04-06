function teamJoin(context, payload) {
  const playerId = context.id();
  const game = context.getGameState();

  const teamIndex = payload.team;
  const team = game.teams[teamIndex];

  // Team doesn't exist
  if (team === undefined) {
    context.send('team:join:failed', { errorCode: 0 });
  }

  // Update the player within the game
  game.players[playerId].team = teamIndex;
  context.updateGameState(game);

  context.broadcastToGame('team:joined', { playerId, team: teamIndex });
  context.send('team:yours', { team });
}

module.exports = {
  'team:join': teamJoin,
};
