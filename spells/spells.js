const spells = [
  {
    event: 'spell:lock:station',
    name: 'Lock Station',
    desc: 'Lock a station for 30 seconds',
    target: 'stations',
    cooldown: 60,
  },
  {
    event: 'spell:player:temporary-pocket',
    name: 'Temporary Pocket',
    desc: 'Unocks the temporary pocket for 2 minutes',
    target: 'player',
    cooldown: 4 * 60,
  },
];

module.exports = spells;
