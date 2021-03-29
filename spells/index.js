// This is where we `require` all of our spell handlers ('event:name': handler)
const lockSpells = require('./locks.js');
const swapTeamRack = require('./swap-team-rack.js');

// And then combine them into one object
module.exports = {
  lockSpells,
  swapTeamRack,
};
