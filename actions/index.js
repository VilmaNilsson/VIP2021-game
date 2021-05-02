// The actions list
const actions = require('./actions');

// TODO: these needs fixing
// const playerImmune = require('./player-immune');
// const playerLoginTime = require('./player-increased-login');
// const playerLocked = require('./player-locked');
// const playerUnlock = require('./player-unlock');
// const playerGetToken = require('./player-get-token');
// const resetAll = require('./reset-all');
// const stationDoubleSalary = require('./station-double-salary');
// const stationHalfSalary = require('./station-half-salary');
// const stationUnlock = require('./station-unlock');
// const stationsDoubleSalary = require('./stations-double-salary');
// const stationsHalfSalary = require('./stations-half-salary');
// const stationLoginTime = require('./station-increased-login');
// const teamsSwapRack = require('./teams-swap-rack');

// NOTE: These are working
const stationLock = require('./station-lock');
const playerSecretCargo = require('./player-secret-cargo');
const teamsLoginIncreased = require('./teams-increased-login');
const stationLoginIncreased = require('./station-increased-login');

// Combine the handlers
const actionHandlers = {
  playerSecretCargo,
  stationLock,
  teamsLoginIncreased,
  stationLoginIncreased,
  // NOTE: don't forget to add more here
};

// Flatten the nested object `spells` into one object
const actionHandlersFlat = Object.values(actionHandlers).reduce((acc, next) => {
  acc = { ...acc, ...next };
  return acc;
}, {});

module.exports = {
  actions,
  actionHandlers: actionHandlersFlat,
};
