function immuneToSpells(context, payload) {

    // First we'll get the game state
    const game = context.getGameState();
  
    // We're not in a game
    if (game === null) {
      context.send('spell:player:immune:fail', { errorCode: 0 });
      return;
    }
  
    // We're not in the play phase
    if (game.properties.phase.type !== 2) {
      context.send('spell:player:immune:fail', { errorCode: 1 });
      return;
    }

    // Have the duration of the spell in a constant for easy reuse
    const duration = 30 * 1000;

    // Now we get the player's id so that we can reach them in the gamestate 
    const playerId = context.id();
  
    // We always use the `properties` key for changing values
    game.players[playerId].properties.immune = true;

    // Update the gamestate (which includes the player)
    context.updateGameState(game);

    // Message the player about their immunity
    context.send('player:immunity', {duration});

    // Reset the player's immunity after 30 seconds
    setTimeout(function() {
        const game = context.getGameState();
        game.players[playerId].properties.immune = false;
        context.updateGameState(game);

        // Message the player that their immunity has ran out
        context.send('player:immunity:faded', {});
    }, duration);
  }
  
  module.exports = {
    'spell:player:immune': immuneToSpells,
  };
  