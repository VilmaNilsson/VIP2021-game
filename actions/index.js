// The actions list
const actions = require('./actions');

// NOTE: These are working
const playerSecretCargo = require('./player-secret-cargo');
const teamSwapRack = require('./team-swap-rack');
const stationX2 = require('./station-x2');
const stationsX2 = require('./stations-x2');
const stationLock = require('./station-lock');
const stationUnlock = require('./station-unlock');
const teamSlow = require('./team-slow');
const teamHaste = require('./team-haste');
const teamShakeScreen = require('./team-shake-screen');
const playerRandomNew = require('./player-random-new');
const playerFillEmpty = require('./player-fill-empty');

// Combine the handlers
const actionHandlers = {
  playerSecretCargo,
  playerRandomNew,
  playerFillEmpty,
  teamSlow,
  teamHaste,
  teamSwapRack,
  teamShakeScreen,
  stationX2,
  stationsX2,
  stationLock,
  stationUnlock,
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
