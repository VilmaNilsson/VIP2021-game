function teamJoin(context, payload) {
  const playerState = context.getPlayerState();
  const playerId = playerState.id;
  const game = context.getGameState();
  const teamName = game.teams[payload];

  playerState.team = payload;
  context.updatePlayerState(playerState);
  game.players[playerId] = playerState;
  context.updateGameState(game);

  context.broadcast('team:joined', { playerId, teamName });
}

module.exports = {
  'team:join': teamJoin,
};
