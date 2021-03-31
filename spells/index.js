// This is where we `require` all of our spell handlers ('event:name': handler)
const lockSpells = require('./locks.js');
const halfSalaryStation = require('./half_salary_station');
const doubleSalary = require('./double_salary.js');

// And then combine them into one object
module.exports = {
  lockSpells,
  halfSalaryStation,
  doubleSalary,
};
