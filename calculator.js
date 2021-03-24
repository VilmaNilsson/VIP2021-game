// We'll place all calculating functions here (salary for a team, login time for
// a station, etc.).

function getTickDuration(game) {
  // In milliseconds
  const playDuration = game.properties.playPhaseDuration * 1000;
  // Duration between salaries (ie. ticks)
  const tickDuration = playDuration / game.properties.nrOfSalaries;
  return tickDuration;
}

module.exports = {
  getTickDuration,
};
