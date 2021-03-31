function teamJoin(context, payload) {
  const playerState = context.getPlayerState();
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];
  const teamIndex = payload.team;
  const teamName = game.teams[teamIndex].name;

  playerState.team = teamIndex;
  context.updatePlayerState(playerState);
  player.team = teamIndex;
  context.updateGameState(game);
  context.broadcastToGame('team:joined', { playerId, teamName });
}

module.exports = {
  'team:join': teamJoin,
};
