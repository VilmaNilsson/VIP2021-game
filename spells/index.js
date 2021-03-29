// This is where we `require` all of our spell handlers ('event:name': handler)
const lockSpells = require('./locks.js');
const immuneToSpells = require('./immuneToSpells.js');

// And then combine them into one object
module.exports = {
  lockSpells,
  immuneToSpells,
};
