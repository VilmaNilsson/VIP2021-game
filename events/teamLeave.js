function teamLeave(context, payload) {
    // Init variables
    const playerId = context.id();
    const gameState = context.getGameState();
    const player = gameState.players[playerId]
    const { team } = gameState.players[playerId];
    const { name } = gameState.teams[team];

    // Update player, -1 for no team
    player.team = -1;

    // Update game state
    gameState.players[playerId] = player;
    context.updateGameState(gameState);

    // Broadcast event
    context.broadcast('team:left', { playerId, name });
}

module.exports = {
    'team:leave': teamLeave,
};