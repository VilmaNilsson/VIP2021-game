function teamLeave(context, payload) {
    // Init variables
    const playerId = context.id();
    const gameState = context.getGameState();
    const player = gameState.players[playerId]
    const { team } = gameState.players[playerId];

    // Update player, -1 for no team
    player.team = -1;

    // Update game state
    gameState.players[playerId] = player;
    context.updateGameState(gameState);

    // Broadcast event
    context.broadcastToGame('team:left', { playerId, team });
}

module.exports = {
    'team:leave': teamLeave,
};