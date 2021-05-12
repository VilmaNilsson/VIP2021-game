// Locks a player that is targeted with a "locked spell" fx. annoy player

// Takes two params, context = object containing functions to operate on state,
// payload = data sent from client-side: team which is the teamId to lock
function lockTeam(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();
  // In this spell we'll receive the team id (from frontend) (the team to be locked)
  const teamId = payload.team;
  const duration = 20;
  const team = game.teams[teamId];

  // They tried targeting an unknown team
  if (teamId === undefined) {
    context.send('action:teams:lock:fail', { errorCode: 0 });
    return false;
  }

  // They tried targeting a team that is already locked
  if (game.teams[teamId].properties.locked === true) {
    context.send('action:teams:lock:fail', { errorCode: 1 });
    return false;
  }

  // We always use the `properties` key for changing values
  // We want to lock the team
  team.properties.locked = true;

  // Save our changes, game is an object we want to merge in to gameState
  context.updateGameState(game);

  // Send info to client about status=locked, teamId, start of the lock and duration
  const start = Date.now();
  context.broadcastToGame('action:teams:locked', { teamId, start, duration: duration * 1000 });

  // Now: we want to make this spell last for as many seconds const duration is,
  // then we want to reset whatever we just did.
  // Instead of writing the same code reversed,
  // could we maybe call the function unlockTeam in team_unlock.js?
  context.setTimeout(() => {
    // We'll just do the reverse for resetting
    const game = context.getGameState();
    const team = game.teams[teamId];
    team.properties.locked = false;
    context.updateGameState(game);
    context.broadcastToGame('action:teams:locked:faded', {});
  }, duration * 1000); // Times are in milliseconds

  return true;
}

module.exports = {
  'action:teams:lock': lockTeam,
};
