// This is where we `require` all of our spell handlers ('event:name': handler)
const lockSpells = require('./locks.js');
const immuneToSpells = require('./immune_To_Spells');
const swapTeamRack = require('./swap-team-rack');
const halfSalaryStation = require('./half_salary_station');
const doubleSalary = require('./double_salary.js');
const doubleSalaryStation = require('./double_salary_station');
const activateTemporaryPocket = require('./activate-temporary-pocket');
const increaseLoginTimePlayer = require('./increase-login-time-player');
const halfSalaryAllStations = require('./half-salary-all-stations');
const getTheOneSpell = require('./get-the-one');

// And then combine them into one object
module.exports = {
  lockSpells,
  immuneToSpells,
  swapTeamRack,
  halfSalaryStation,
  doubleSalary,
  doubleSalaryStation,
  activateTemporaryPocket,
  increaseLoginTimePlayer,
  halfSalaryAllStations,
  getTheOneSpell,
};
