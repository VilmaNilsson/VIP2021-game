/* eslint-disable linebreak-style */
// This is where we `require` all of our spell handlers ('event:name': handler)
const lockSpells = require('./locks.js');
const unlockStationSpell = require('./unlock-station.js');

// And then combine them into one object
module.exports = {
  lockSpells,
  unlockStationSpell,
};
