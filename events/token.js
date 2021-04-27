const utils = require('../utils');

// Gets the relevant player object key based on the payload
function getPlayerCargoKey(from, to) {
  if (typeof from === 'string') {
    return from === 'cargo' ? 'cargo' : 'secretCargo';
  }
  return to === 'cargo' ? 'cargo' : 'secretCargo';
}

function tokenSwap(context, payload) {
  const game = context.getGameState();

  // Not within a game
  if (game === null) {
    context.send('token:swap:fail', { errorCode: 0 });
    return;
  }

  // Game is not active
  if (game.properties.phase.type !== 2) {
    context.send('token:swap:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();
  const player = game.players[playerId];

  // Not within a team
  if (player.team === -1) {
    context.send('token:swap:fail', { errorCode: 2 });
    return;
  }

  // from:  {String|Number} 'cargo|secret-cargo' or 0 (slot index)
  // to:    {String|Number} 'cargo|secret-cargo' or 0 (slot index)
  //
  // If the destination (cargo to slot) has a token, we'll replace them
  const { to, from } = payload;

  // Not enough payload
  if (to === undefined || from === undefined) {
    context.send('token:swap:fail', { errorCode: 3 });
    return;
  }

  // Invalid payload
  if (typeof to !== 'number' && typeof to !== 'string'
    && typeof from !== 'number' && typeof from !== 'string') {
    context.send('token:swap:fail', { errorCode: 3.1 });
    return;
  }

  // The swap has to be from two separate places
  if (to === from) {
    context.send('token:swap:fail', { errorCode: 4 });
    return;
  }

  // Not within a station
  if ((typeof to === 'number' || typeof from === 'number')
    && player.properties.inStation === null) {
    context.send('token:swap:fail', { errorCode: 5 });
    return;
  }

  // Check if they're using the secret cargo, if its locked it will fail
  if ((from === 'secret-cargo' || to === 'secret-cargo')
    && player.properties.secretCargo.locked === true) {
    context.send('token:swap:fail', { errorCode: 6 });
    return;
  }

  // Between cargos
  // ===============
  if (typeof from === 'string' && typeof to === 'string') {
    // Swap the two
    const prevCargo = player.properties.cargo.token;
    const prevTemporaryCargo = player.properties.secretCargo.token;
    player.properties.cargo.token = prevTemporaryCargo;
    player.properties.secretCargo.token = prevCargo;

    // Update the game (ie. the player)
    game.players[playerId] = player;
    context.updateGameState(game);

    const { cargo, secretCargo } = player.properties;
    context.send('player:cargos', { cargo, secretCargo });
    return;
  }

  const stationIndex = player.properties.inStation.station;
  const playerIds = utils.getPlayersInStation(game, stationIndex);

  // Between slots
  // =================
  if (typeof from === 'number' && typeof to === 'number') {
    const teamIndex = player.team;
    const fromSlotIndex = from;
    const toSlotIndex = to;
    const station = game.stations[stationIndex];

    // Store the current slot values
    const prevFromSlot = station.racks[teamIndex].slots[fromSlotIndex];
    const prevToSlot = station.racks[teamIndex].slots[toSlotIndex];

    station.racks[teamIndex].slots[fromSlotIndex] = prevToSlot;
    station.racks[teamIndex].slots[toSlotIndex] = prevFromSlot;
    // Update the game state
    game.stations[stationIndex] = station;
    context.updateGameState(game);

    // Broadcast the updated rack
    context.broadcastTo(playerIds, 'station:rack', {
      station: stationIndex,
      team: teamIndex,
      rack: station.racks[teamIndex],
    });

    return;
  }

  // From cargos to slot (or vice versa)
  // ====================================
  const teamIndex = player.team;
  const slotIndex = typeof from === 'number' ? from : to;
  const station = game.stations[stationIndex];

  const playerCargo = getPlayerCargoKey(from, to);

  // Store the current cargo/slot values
  const prevSlot = station.racks[teamIndex].slots[slotIndex];
  const prevCargo = player.properties[playerCargo].token;

  // Move the new token to the slot
  const nextSlot = { token: prevCargo };
  station.racks[teamIndex].slots[slotIndex] = nextSlot;

  // Update the player cargo or secret cargo
  player.properties[playerCargo].token = prevSlot.token;

  // This is how you get points:
  // ===========================

  // Check if the token swap means a rack has a row of same tokens
  const slots = station.racks[teamIndex].slots.map((slot) => slot.token);
  const sameSlots = slots.every((slot) => slot === slots[0]);
  const noEmptySlots = slots.every((slot) => slot !== -1);

  // All the tokens are the same = points!
  if (noEmptySlots && sameSlots) {
    game.teams[teamIndex].properties.score += 1;
    station.racks[teamIndex].slots = utils.createRack(game.tokens.length);

    // Broadcast the updated score
    const score = utils.getTeamScores(game);
    context.broadcastToGame('game:score', { score });
  } else {
    // Only unique slots in a rack also gives points
    const uniqueSlots = new Set(slots).size === slots.length;

    if (noEmptySlots && uniqueSlots) {
      game.teams[teamIndex].properties.score += 1;
      station.racks[teamIndex].slots = utils.createRack(game.tokens.length);

      // Broadcast the updated score
      const score = utils.getTeamScores(game);
      context.broadcastToGame('game:score', { score });
    }
  }

  // ===========================

  // Update the game state
  game.stations[stationIndex] = station;
  game.players[playerId] = player;
  context.updateGameState(game);

  // Broadcast the updated rack
  context.broadcastTo(playerIds, 'station:rack', {
    station: stationIndex,
    team: teamIndex,
    rack: station.racks[teamIndex],
  });

  // Send the players updated cargo
  const { cargo, secretCargo } = player.properties;
  context.send('player:cargos', { cargo, secretCargo });
}

// NOTE: We could make tokens selectable if we want since they are objects, then
// other players would see if someone has a token selected (might be overkill)

module.exports = {
  'token:swap': tokenSwap,
};
