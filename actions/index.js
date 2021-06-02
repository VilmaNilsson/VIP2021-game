// The actions list
const actions = require('./actions');

// TODO: these needs fixing
// const playerImmune = require('./player-immune');
// const playerGetToken = require('./player-get-token');
// const resetAll = require('./reset-all');
// const stationDoubleSalary = require('./station-double-salary');
// const stationsDoubleSalary = require('./stations-double-salary');
// const stationLoginTime = require('./station-increased-login');
// const teamLock = require('./team-lock');
// const teamUnlock = require('./team-unlock');
// const teamsLoginIncreased = require('./teams-increased-login');
// const stationLoginIncreased = require('./station-increased-login');

// NOTE: These are working
const playerSecretCargo = require('./player-secret-cargo');
const racksSwap = require('./racks-swap');
const stationX2 = require('./station-x2');
const stationsX2 = require('./stations-x2');
const stationLock = require('./station-lock');
const stationUnlock = require('./station-unlock');
const teamSlow = require('./team-slow');
const reRack = require('./player-random-new');

// Combine the handlers
const actionHandlers = {
  playerSecretCargo,
  racksSwap,
  stationX2,
  stationsX2,
  stationLock,
  stationUnlock,
  teamSlow,
  reRack,
  // NOTE: don't forget to add more here
};

// Flatten the nested object `spells` into one object
const actionHandlersFlat = Object
  .values(actionHandlers)
  .reduce((acc, next) => {
    return { ...acc, ...next };
  }, {});

module.exports = {
  actions,
  actionHandlers: actionHandlersFlat,
};
