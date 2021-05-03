const actions = [
  {
    event: 'action:station:lock',
    name: 'Lock Station',
    desc: 'Lock a station for 30 seconds',
    target: 'stations',
    cooldown: 60,
  },
  {
    event: 'action:player:secret-cargo',
    name: 'Secret Cargo',
    desc: 'Unocks the secret cargo for 2 minutes',
    target: 'player',
    cooldown: 4 * 60,
  },
  {
    event: 'action:teams:slowed',
    name: 'Increase login time - Team',
    desc: 'Increase the login time for an entire team for 1 minute',
    target: 'teams',
    cooldown: 3 * 60,
  },
  {
    event: 'action:station:slowed',
    name: 'Increase login time - Station',
    desc: 'Increase the login time on a station for all teams for 1 minute',
    target: 'stations',
    cooldown: 2 * 60,
  },
  {
    event: 'action:station:fill-empty',
    name: 'Fill Empty',
    desc: 'Places a random token in selected slot within the station',
    target: 'stations',
    cooldown: 2 * 60,
  },
];

module.exports = actions;
