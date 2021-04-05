function halfSalaryAllStations(context) {
  const GAME = context.getGameState();
  const { stations } = GAME;

  for (let i = 0; i < stations.length; i += 1) {
    stations[i].properties.salaryMultiplier = 0.5;
  }

  const newGame = { ...GAME };
  context.updateGameState(newGame);
  context.broadcast('stations:half-salary', {});

  context.onNextGameTick(() => {
    for (let i = 0; i < stations.length; i += 1) {
      const defaultValue = stations[i].default.salaryMultiplier;

      stations[i].properties.salaryMultiplier = defaultValue;
    }

    const newGame = { ...GAME };
    context.updateGameState(newGame);

    context.broadcast('stations:half-salary:faded', {});
  });
}

module.exports = {
  'spell:stations:half-salary': halfSalaryAllStations,
};
