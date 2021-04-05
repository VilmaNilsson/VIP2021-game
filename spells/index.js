/* eslint-disable linebreak-style */
// This is where we `require` all of our spell handlers ('event:name': handler)
const playerImmune = require('./player-immune');
const playerIncLogin = require('./player-increased-login');
const playerLocked = require('./player-locked');
const playerTemporaryPocket = require('./player-temporary-pocket');
const playerUnlocked = require('./player-unlocked');
const resetAll = require('./reset-all');
const stationDoubleSalary = require('./station-double-salary');
const stationHalfSalary = require('./station-half-salary');
const stationLock = require('./station-lock');
const stationUnlock = require('./station-unlock');
const stationsDoubleSalary = require('./stations-double-salary');
const stationsHalfSalary = require('./stations-half-salary');
const teamsSwapRack = require('./teams-swap-rack');

// And then combine them into one object
module.exports = {
  playerImmune,
  playerIncLogin,
  playerLocked,
  playerTemporaryPocket,
  playerUnlocked,
  resetAll,
  stationDoubleSalary,
  stationHalfSalary,
  stationLock,
  stationUnlock,
  stationsDoubleSalary,
  stationsHalfSalary,
  teamsSwapRack,
};
