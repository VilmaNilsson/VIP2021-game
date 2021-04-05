function teamLeave(context) {
  // Init variables
  const playerId = context.id();
  const game = context.getGameState();
  const player = game.players[playerId];
  const { team } = player;

  // Update player, -1 for no team
  player.team = -1;

  // Update game state
  game.players[playerId] = player;
  context.updateGameState(game);

  // Broadcast event
  context.broadcastToGame('team:left', { playerId, team });
  context.send('team:yours', { team: -1 });
}

module.exports = {
  'team:leave': teamLeave,
};
