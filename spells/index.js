// This is where we `require` all of our spell handlers ('event:name': handler)
const lockSpells = require('./locks.js');
const unlockPlayer = require('./unlock_player.js');

// And then combine them into one object
module.exports = {
  lockSpells,
  unlockPlayer,
};
