function IncreasedlogintimeSpell(context, payload) {
	// etat du jeu
    const game = context.getGameState();
	
    // si on est pas en partie
    if (game === null) {
      context.send('spell:station:increasedlogintime:fail', { errorCode: 0 });
      return;
    }
  
    // test de la phase de jeu
    if (game.properties.phase.type !== 2) {
      context.send('spell:station:increasedlogintime:fail', { errorCode: 1 });
      return;
    }
  
    // on recois l'index de la station selectionné
    const stationIndex = payload.station;
    // on trouve la station correspondante
    const station = game.stations[stationIndex];
  
    // on verifie si la station existe
    if (station === undefined) {
      context.send('spell:station:increasedlogintime:fail', { errorCode: 2 });
      return;
    }
  
    // on change la valeur du login time, ici on est passé de 5 a 15 seconds
    station.properties.loginTime = 15;
    // On renvoi la station modifié
    game.stations[stationIndex] = station;
    // on sauvegarde les changements
    context.updateGameState(game);
    // Et on l'envoi a tout les joueurs
    context.broadcastToGame('station:increasedlogintime', { station: stationIndex });

    // On reset les parametre au projet "temps de jeu"
    context.onNextGameTick(() => {
        const game = context.getGameState();
        const stationIndex = payload.station;
        const station = game.stations[stationIndex];
        station.properties.loginTime = 5;
        game.stations[stationIndex] = station;
        context.updateGameState(game);
        context.broadcastToGame('station:,normallogintime', { station: stationIndex });
    });
}

module.exports = {
  'spell:increasedlogintime': lockStationSpell,
};