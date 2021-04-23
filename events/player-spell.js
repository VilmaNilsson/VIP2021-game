const spells = require('../spells');

function playSpell(context, payload) {
  // Take out only the event name
  const { event, index, ...rest } = payload;

  const game = context.getGameState();

  // Player is not within a game
  if (game === null) {
    context.send('player:spell:fail', { errorCode: 0 });
    return;
  }

  // The game is not ongoing
  if (game.properties.phase.type !== 2) {
    context.send('player:spell:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();

  const player = game.players[playerId];
  const playerSpell = player.properties.spells[index];

  // Player doesn't have the spell
  if (playerSpell === undefined || playerSpell.event !== event) {
    context.send('player:spell:fail', { errorCode: 2 });
    return;
  }

  const spellHandler = spells.spellHandlers[event];

  // There is no handler for the spell
  if (spellHandler === undefined) {
    context.send('player:spell:fail', { errorCode: 3 });
    return;
  }

  // Invalid spell handler
  if (typeof spellHandler !== 'function') {
    context.send('player:spell:fail', { errorCode: 4 });
    return;
  }

  // Spell is on cooldown
  if (playerSpell.timeout) {
    context.send('player:spell:fail', { errorCode: 5 });
    return;
  }

  // Pass on the parameters
  const success = spellHandler(context, rest);

  // NOTE: we could use "target" as a generic term for indexes? or index...

  // If the spell was cast, we'll start the cooldown timer
  if (success) {
    const start = Date.now();
    const duration = playerSpell.cooldown * 1000;

    // Start the timer that resets the cooldown
    const timeout = context.setTimeout(() => {
      const game = context.getGameState();
      const player = game.players[playerId];
      player.properties.spells[index].start = null;
      player.properties.spells[index].timeout = null;
      game.players[playerId] = player;
      context.updateGameState(game);
      context.send('player:spell:cooldown:done', { index });
    }, duration);

    // Start the cooldown
    player.properties.spells[index] = { ...playerSpell, timeout };
    game.players[playerId] = player;
    // Only update the key `players` (NOTE: this used to overwrite the timers)
    context.updateGameState({ players: game.players });
    context.send('player:spell:cooldown', { index, start, duration });
  }
}

function selectSpell(context, payload) {
  const game = context.getGameState();

  // Not in a game
  if (game === null) {
    context.send('player:spell:select:fail', { errorCode: 0 });
    return;
  }

  // Not in the plan phase
  if (game.properties.phase.type !== 1) {
    context.send('player:spell:select:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();
  const player = game.players[playerId];

  // Too many spells
  if (player.properties.spells.length >= 4) {
    context.send('player:spell:select:fail', { errorCode: 2 });
    return;
  }

  // Grab the spell from the spell list
  const { event } = payload;
  const spell = spells.spells.find((s) => s.event === event);

  // Spell doesn't exist
  if (spell === undefined) {
    context.send('player:spell:select:fail', { errorCode: 3 });
    return;
  }

  // Add the spell and update the game state
  player.properties.spells = [...player.properties.spells, spell];
  game.players[playerId] = player;
  context.updateGameState(game);

  // Send the player spell list back
  context.send('player:spells', { spells: player.properties.spells });
}

function deselectSpell(context, payload) {
  const game = context.getGameState();

  // Not in a game
  if (game === null) {
    context.send('player:spell:deselect:fail', { errorCode: 0 });
    return;
  }

  // Not in the plan phase
  if (game.properties.phase.type !== 1) {
    context.send('player:spell:deselect:fail', { errorCode: 1 });
    return;
  }

  const playerId = context.id();
  const player = game.players[playerId];

  // Got no spells (do nothing)
  if (player.properties.spells.length === 0) {
    return;
  }

  // Grab the spell from the spell list
  const { event } = payload;
  const playerSpells = player.properties.spells;
  const spellIndex = playerSpells.findIndex((s) => s.event === event);

  // Spell doesn't exist
  if (spellIndex === -1) {
    context.send('player:spell:deselect:fail', { errorCode: 2 });
    return;
  }

  // Remove the spell and update the game state
  player.properties.spells.splice(spellIndex, 1);
  game.players[playerId] = player;
  context.updateGameState(game);

  // Send the player spell list back
  context.send('player:spells', { spells: player.properties.spells });
}

module.exports = {
  'player:spell': playSpell,
  'player:spell:select': selectSpell,
  'player:spell:deselect': deselectSpell,
};
