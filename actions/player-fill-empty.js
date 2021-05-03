/* eslint-disable linebreak-style */
const utils = require('../utils');

function fillEmpty(context, payload) {
    // payload=none
    const game = context.getGameState();
    const playerId = context.id();

    // there is no game
    if (game === null) {
      context.send('action:station:fill-empty:fail', { errorCode: 0 });
      return false;
    }
  
    const gamePhase = game.properties.phase.type;
    const player = game.players[playerId];
  
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
    if (utils.isRackFull(station, player.team)) {
        context.send('action:station:fill-empty:fail', { errorCode: 3 });
        return false;
    }
  
    // We give the connected station a random token 
    station.racks[player.team].slots.every((slot) => {
        if(slot.token === -1){
            // Assign random token
            slot.token = Math.floor(Math.random() * game.tokens.length);
            return false;
        } else {
            return true;
        }
    });
  
    // save the changes
    context.updategame(game);
  
    // send back message to logged players in planet with the event and slot + token as payload
    const playerIds = utils.getPlayersInStation(game, station);
    context.broadcastTo(playerIds, 'station:filled-empty', { station, racks });
  
    return true;
  }
  
  module.exports = {
    'action:station:fill-empty': fillEmpty,
  };
  