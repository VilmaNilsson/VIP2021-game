// When you receive your own player object
function playerYou(context, payload) {
  context.setState(payload);

  if (payload.id) {
    context.setCache('_uid', payload.id);
  }
}

// When we select/deselect spells
function playerSpells(context, payload) {
  const { spells } = payload;
  const { player } = context.getState();

  if (!player) {
    return;
  }

  player.spells = spells;
  context.setState({ player });
}

// Updates to our pockets
function playerPockets(context, payload) {
  const { pocket, temporaryPocket } = payload;
  const { player } = context.getState();

  if (!player) {
    return;
  }

  player.pocket = pocket;
  player.temporaryPocket = temporaryPocket;
  
  context.setState({ player });
}

// When we try to reconnect
function playerReconnect(context, payload) {
  const { player, game, racks } = payload;
  context.setState({ player, game, racks });
}

export default {
  'player:you': playerYou,
  'player:spells': playerSpells,
  'player:pockets': playerPockets,
  'player:reconnect': playerReconnect,
};
