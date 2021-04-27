// The spells list
const spells = require('./spells');
// This is where we `require` all of our spell handlers ('event:name': handler)
const playerImmune = require('./player-immune');
const playerLoginTime = require('./player-increased-login');
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
const stationLoginTime = require('./station-increased-login');
const teamsSwapRack = require('./teams-swap-rack');

// Combine the handlers
const spellHandlers = {
  playerImmune,
  playerLoginTime,
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
  stationLoginTime,
  teamsSwapRack,
};

// Flatten the nested object `spells` into one object
const sphs = Object.values(spellHandlers).reduce((acc, next) => {
  acc = { ...acc, ...next };
  return acc;
}, {});

module.exports = {
  spells,
  spellHandlers: sphs,
};
