// When you receive your own player object
function playerYou(context, payload) {
  context.setState(payload);

  if (payload.id) {
    context.setCache('_uid', payload.id);
  }
}

// When we select/deselect actions
function playerActions(context, payload) {
  const { actions } = payload;
  const { player } = context.getState();

  if (!player) {
    return;
  }

  player.actions = actions;
  context.setState({ player });
}

// Updates to our cargos
function playerCargos(context, payload) {
  const { cargo, secretCargo } = payload;
  const { player } = context.getState();

  if (!player) {
    return;
  }

  player.cargo = cargo;
  player.secretCargo = secretCargo;

  context.setState({ player });
}

// When we try to reconnect
function playerReconnect(context, payload) {
  context.setState(payload);
}

export default {
  'player:you': playerYou,
  'player:actions': playerActions,
  'player:cargos': playerCargos,
  'player:reconnect': playerReconnect,
};
