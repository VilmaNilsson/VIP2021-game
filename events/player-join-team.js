function teamJoin(context, payload) {
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];

  const teamIndex = payload.team;
  const team = game.teams[teamIndex];

  // Team doesn't exist
  if (team === undefined) {
    context.send('team:join:fail', { errorCode: 0 });
  }

  // TODO: check if a player is already in a team, then leave->join?

  // Update the player within the game
  player.team = teamIndex;
  game.players[playerId] = player
  context.updateGameState(game);

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
