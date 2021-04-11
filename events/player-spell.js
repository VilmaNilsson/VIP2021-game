const spells = require('../spells');

function playSpell(context, payload) {
  // Take out only the event name
  const { event, ...rest } = payload;

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
  const playerSpells = player.properties.spells;
  const playerSpell = playerSpells.find((s) => s.event === event);

  // Player doesn't have the spell
  if (playerSpell === undefined) {
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

  // Pass on the parameters
  spellHandler(context, rest);
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
