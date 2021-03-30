// This is where we `require` all of our spell handlers ('event:name': handler)
const lockSpells = require('./locks.js');
const immuneToSpells = require('./immune_To_Spells');
const swapTeamRack = require('./swap-team-rack');
const halfSalaryStation = require('./half_salary_station');
const doubleSalaryStation = require('./double_salary_station');
const activateTemporaryPocket = require('./activate-temporary-pocket');

// And then combine them into one object
module.exports = {
  lockSpells,
  immuneToSpells,
  swapTeamRack,
  halfSalaryStation,
  doubleSalaryStation,
  activateTemporaryPocket,
};
