// The spells list
const spells = require('./spells');
// This is where we `require` all of our spell handlers ('event:name': handler)
const playerImmune = require('./player-immune');
const playerIncLogin = require('./player-increased-login');
const playerLocked = require('./player-locked');
const playerTemporaryPocket = require('./player-temporary-pocket');
const playerUnlock = require('./player-unlock');
const playerGetToken = require('./player-get-token');
const resetAll = require('./reset-all');
const stationDoubleSalary = require('./station-double-salary');
const stationHalfSalary = require('./station-half-salary');
const stationLock = require('./station-lock');
const stationUnlock = require('./station-unlock');
const stationsDoubleSalary = require('./stations-double-salary');
const stationsHalfSalary = require('./stations-half-salary');
const teamsSwapRack = require('./teams-swap-rack');

// Combine the handlers
const spellHandlers = {
  playerImmune,
  playerIncLogin,
  playerLocked,
  playerTemporaryPocket,
  playerUnlock,
  playerGetToken,
  resetAll,
  stationDoubleSalary,
  stationHalfSalary,
  stationLock,
  stationUnlock,
  stationsDoubleSalary,
  stationsHalfSalary,
  teamsSwapRack,
};

// Flatten the nested object `spells` onto one object
const flattenedSpellHandlers = Object.value(spells).reduce((acc, next) => {
  acc = { ...acc, ...next };
  return acc;
}, {});

module.exports = {
  spells,
  spellHandlers: flattenedSpellHandlers,,
};
