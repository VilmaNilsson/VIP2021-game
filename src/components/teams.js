function Teams(el, context) {
  const { game } = context.getState();

  if (!game) {
    return el;
  }

  game.teams.forEach((team, i) => {
    const div = document.createElement('div');

    div.textContent = `${team.name} (${team.score})`;

    // The game-score event gives us the latest scores, no need to calculate
    // anything
    div.subscribe('game:score', (e) => {
      const { score } = e.detail;
      const newScore = score[i];
      el.textContent = `${team.name} (${newScore})`;
    });

    el.append(div);
  });

  return el;
}

export default Teams;
