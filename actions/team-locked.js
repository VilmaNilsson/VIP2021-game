const utils =  require('../utils');
// Locks a player that is targeted with a "locked spell" fx. annoy player

// Takes two params, context = object containing functions to operate on state,
// payload = data sent from client-side: player-id AND duration in sec for the spell
function lockTeam(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();

  // In this spell we'll receive the team id (from frontend) (the player to be locked),
  // and the duration of spell
  // Payload.duration MUST be a number, not a string, to work in the setTimeout
  const { team, duration } = payload;


  // They tried targeting an unknown player
  if (team === undefined) {
    context.send('action:lock:team:fail', { errorCode: 0 });
    return false;
  }

  // They tried targeting a player that is already locked
  if (game.teams[team].properties.locked === true) {
    context.send('action:lock:team:fail', { errorCode: 1 });
    return false;
  }

  // We always use the `properties` key for changing values
  // We want to lock the player
  team.properties.locked = true;


  // Save our changes, game is an object we want to merge in to gameState
  context.updateGameState(game);

  // Send info to client about status=locked
  const teamPlayers = utils.getPlayersInTeam(game, team);
  context.sendTo(teamPlayers, 'action:team:locked', { duration });

  // Now: we want to make this spell last for as many seconds const duration is,
  // then we want to reset whatever we just did.
  // Instead of writing the same code reversed,
  // could we maybe call the function unlockPlayer in unlock_player.js?
  context.setTimeout(() => {
    // We'll just do the reverse for resetting
    const game = context.getGameState();
    const team = game.teams[team];
    team.properties.locked = false;
    context.updateGameState(game);
    context.sendTo(teamPlayers, 'action:team:locked:faded', {});
  }, duration * 1000); // Times are in milliseconds

  return true;
}

module.exports = {
  'action:team:lock': lockTeam,
};
