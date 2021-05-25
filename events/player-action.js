const actions = require('../actions');

function playAction(context, payload) {
  // Take out only the event name and index (incase we have same actions)
  const { event, index, ...rest } = payload;

  const game = context.getGameState();

  // Player is not within a game
  if (game === null) {
    context.send('player:action:fail', { errorCode: 0 });
    return;
  }

  // The game is not ongoing
  if (game.properties.phase.type !== 2) {
    context.send('player:action:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();

  const player = game.players[playerId];
  const playerAction = player.properties.actions[index];

  // Player doesn't have the action
  if (playerAction === undefined || playerAction.event !== event) {
    context.send('player:action:fail', { errorCode: 2 });
    return;
  }

  const actionHandler = actions.actionHandlers[event];

  // There is no handler for the action
  if (actionHandler === undefined) {
    context.send('player:action:fail', { errorCode: 3 });
    return;
  }

  // Invalid action handler
  if (typeof actionHandler !== 'function') {
    context.send('player:action:fail', { errorCode: 4 });
    return;
  }

  // Action is on cooldown
  if (playerAction.timeout) {
    context.send('player:action:fail', { errorCode: 5 });
    return;
  }

  // Pass on the parameters
  const success = actionHandler(context, rest);

  // If the action was cast, we'll start the cooldown timer
  if (success) {
    const start = Date.now();
    const duration = playerAction.cooldown * 1000;

    // Start the timer that resets the cooldown
    const timeout = context.setTimeout(() => {
      const game = context.getGameState();
      const player = game.players[playerId];

      // Reset is done by clearing the starting time and timeout
      player.properties.actions[index].start = null;
      player.properties.actions[index].timeout = null;
      game.players[playerId] = player;

      context.updateGameState(game);
      context.send('player:action:cooldown:done', { index });
    }, duration);

    // Start the cooldown
    player.properties.actions[index] = { ...playerAction, timeout, start };
    game.players[playerId] = player;
    // Only update the key `players` (NOTE: this used to overwrite the timers)
    context.updateGameState({ players: game.players });
    context.send('player:action:cooldown', { index, start, duration });
  }
}

function selectAction(context, payload) {
  const game = context.getGameState();

  // Not in a game
  if (game === null) {
    context.send('player:action:select:fail', { errorCode: 0 });
    return;
  }

  // Not in the plan phase
  if (game.properties.phase.type !== 1) {
    context.send('player:action:select:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();
  const player = game.players[playerId];

  // NOTE: this is where we assign the max limit of actions to own
  // Too many actions
  if (player.properties.actions.length >= 2) {
    context.send('player:action:select:fail', { errorCode: 2 });
    return;
  }

  // Grab the action from the action list
  const { event } = payload;
  const action = actions.actions.find((s) => s.event === event);

  // Action doesn't exist
  if (action === undefined) {
    context.send('player:action:select:fail', { errorCode: 3 });
    return;
  }

  // Add the action and update the game state
  player.properties.actions = [...player.properties.actions, action];
  game.players[playerId] = player;
  context.updateGameState(game);

  // Send the player action list back
  context.send('player:actions', { actions: player.properties.actions });
}

function deselectAction(context, payload) {
  const game = context.getGameState();

  // Not in a game
  if (game === null) {
    context.send('player:action:deselect:fail', { errorCode: 0 });
    return;
  }

  // Not in the plan phase
  if (game.properties.phase.type !== 1) {
    context.send('player:action:deselect:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();
  const player = game.players[playerId];

  // Got no actions (do nothing)
  if (player.properties.actions.length === 0) {
    return;
  }

  // Grab the action from the action list
  const { event } = payload;
  const playerActions = player.properties.actions;
  const actionIndex = playerActions.findIndex((s) => s.event === event);

  // Action doesn't exist
  if (actionIndex === -1) {
    context.send('player:action:deselect:fail', { errorCode: 2 });
    return;
  }

  // Remove the action and update the game state
  player.properties.actions.splice(actionIndex, 1);
  game.players[playerId] = player;
  context.updateGameState(game);

  // Send the player action list back
  context.send('player:actions', { actions: player.properties.actions });
}

module.exports = {
  'player:action': playAction,
  'player:action:select': selectAction,
  'player:action:deselect': deselectAction,
};
