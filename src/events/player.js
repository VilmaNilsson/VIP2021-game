import Router from '../router';

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

  // Current URL path
  const path = window.location.pathname;
  // Paths for different game phases (since phases are 0-1-2)
  const gamePaths = ['/lobby', '/plan', '/play'];
  // Lets check if the user is within a game when reconnecting
  const { game } = payload;
  // If so, we'll see if we need to navigate them to the correct path
  if (game) {
    // The current game phase path
    const phasePath = gamePaths[game.phase.type];

    // If the player isn't on the correct path, navigate them to it
    if (path !== phasePath) {
      Router.navigate(phasePath);
    }
  // If they're not inside a game, they shouldnt be able to visit our game views
  } else {
    // They're at one of our game paths
    if (gamePaths.includes(path)) {
      Router.navigate('/');
    }
  }
}

// Failed reconnects results in a redirection to /login
function playerReconnectFail(context, payload) {
  Router.navigate('/login');  
}

export default {
  'player:you': playerYou,
  'player:actions': playerActions,
  'player:cargos': playerCargos,
  'player:reconnect': playerReconnect,
  'player:reconnect:fail': playerReconnectFail,
};
