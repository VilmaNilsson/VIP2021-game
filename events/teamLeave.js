function teamLeave(context, payload) {
    // Init variables
    const playerState = context.getPlayerState();
    const { id } = playerState;
    const gameState = context.getGameState();
    const { team } = gameState.players[id];
    const teamName = gameState.teams[team];

    // Update player, -1 for no team
    playerState.team = -1;
    context.updatePlayerState(playerState);

    // Update game state
    gameState.players[id] = playerState;
    context.updateGameState(gameState);

    // Broadcast event
    context.broadcast('team:left', { id, teamName });
}

module.exports = {
    'team:leave': teamLeave,
};