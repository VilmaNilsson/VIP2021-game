/* eslint-disable linebreak-style */
const utils = require('../utils');

function fillEmpty(context, payload) {
    // payload=none
    const gameState = context.getGameState();
    const playerId = context.id();

    // there is no game
    if (gameState === null) {
      context.send('action:station:fill-empty:fail', { errorCode: 0 });
      return false;
    }
  
    const gamePhase = gameState.properties.phase.type;
    const player = gameState.players[playerId];
  
    // not in the play phase
    if (gamePhase !== 2) {
      context.send('action:station:fill-empty:fail', { errorCode: 1 });
      return false;
    }

    // Fail if player is not logged in a station
    if (player.inStation === null) {
        context.send('action:station:fill-empty:fail', { errorCode: 2 });
        return false;
    }

    const station = player.inStation;

    // Fail if there is no free slot in planet
    // if (station.racks[player.team].slot === undefined) {
    //     context.send('action:station:fill-empty:fail', { errorCode: 3 });
    //     return false;
    // }
  
    // We give the connected station a random token 
  
    // save the changes
    context.updateGameState(gameState);
  
    // send back message to logged players in planet with the event and slot + token as payload
    // const playerIds = utils.getPlayersInStation(game, station);
    context.send('station:filled-empty', { token: payload.token });
  
    return true;
  }
  
  module.exports = {
    'action:station:fill-empty': fillEmpty,
  };
  