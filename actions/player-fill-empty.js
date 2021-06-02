/* eslint-disable linebreak-style */
const utils = require('../utils');


function fillEmpty(context, payload) {
    console.log('ääe sluta nu');
    const game = context.getGameState();
    // The players id
    const playerId = context.id();

    // there is no game
    if (game === null) {
      context.send('action:station:fill-empty:fail', { errorCode: 0 });
      return false;
    }
  
    const gamePhase = game.properties.phase.type;
    // Get the player's object with information about fx team
    const player = game.players[playerId];
    // get the players team
    const yourTeam = player.team;
  
    // not in the play phase
    if (gamePhase !== 2) {
      context.send('action:station:fill-empty:fail', { errorCode: 1 });
      return false;
    }

    // Fail if player is not landed on a planet
    if (player.inStation === null) {
        context.send('action:station:fill-empty:fail', { errorCode: 2 });
        return false;
    }

    // The current planet
    const station = player.inStation;
    // Your rack
    const yourRack = station.rack[yourTeam];

    console.log(utils.isRackFull(station, yourTeam));
    // Fail if there is no free slot in planet
    if (utils.isRackFull(station, yourTeam)) {
        context.send('action:station:fill-empty:fail', { errorCode: 'tjubbido' });
        return false;
    }
  
    // We give the connected planet a random token 
    station.rack[yourTeam].slots.every((slot) => {
        if(slot.token === -1){
            // Assign random token
            slot.token = Math.floor(Math.random() * game.tokens.length);
            return false;
        } else {
            return true;
        }
    });
  
    // save the changes
    // old - context.updategame(game);
    context.updateGameState(game);
  
    // send back message to logged players in planet with the event and station + racks as payload
    //const playerIds = utils.getPlayersInStation(game, station);
    //context.broadcastTo(playerIds, 'station:rack', { station, racks });

    // Broadcast event to everyone within the station
    context.broadcastTo(playerIds, 'station:rack', { team: yourTeam, rack: yourRack, scored: false });

    // check if action updates the score
    //utils.checkActionForScore(context, game, station, yourTeam);
  
    return true;
  }
  
  module.exports = {
    'action:player:fill-empty': fillEmpty,
  };
  