const utils =  require('../utils');
// Unlocks a player that is targeted with a "locked spell" fx. annoy
// Takes two params, context = object containing functions to operate on state,
// payload = data sent from client-side, in this case player-id for the targeted player
function unlockTeam(context, payload) {
  // First we'll get the game state
  const game = context.getGameState();

  // In this spell we'll receive the team id (from frontend) (the player to be unlocked)
  const { team } = payload;

  // They tried targeting an unknown player
  if (team === undefined) {
    context.send('action:unlock:player:fail', { errorCode: 0 });
    return false;
  }

  // We always use the `properties` key for changing values
  // We want to unlock the player
  game.teams[team].properties.locked = false;


  // Save our changes, game is an object we want to merge in to gameState
  context.updateGameState(game);

  // Broadcast to the team/game
  const teamPlayers = utils.getPlayersInTeam(game, team);
  context.broadcast(teamPlayers, 'action:player:unlocked', { team: team });

  return true;
}

module.exports = {
  'action:team:unlock': unlockTeam,
};
