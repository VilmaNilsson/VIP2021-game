function teamLeave(context, payload) {
    // Init variables
    const playerState = context.getPlayerState();
    const { playerId } = playerState.id;

    // TO-DO: update player, -1 for no team

    // TO-DO: update game state

    // TO-DO: broadcast event 
}

export default {
    'team:leave': teamLeave,
};