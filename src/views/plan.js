function PlanView(context) {
  const el = document.createElement('div');

  el.innerHTML = `
    <h1>Plan</h1>
    <div id="timer"></div>
    <h2>Actions</h2>
    <div id="actions"></div>
    <h3>Your actions</h3>
    <div id="player-actions"></div>
    <button id="quit">Quit</button>
  `;

  const timerElem = el.querySelector('#timer');
  const actionsElem = el.querySelector('#actions');
  const playerActionsElem = el.querySelector('#player-actions');

  const { game } = context.getState();

  // NOTE: Make the timer into a component
  const { start, duration, spells } = game.phase;
  const end = start + duration;

  const interval = context.setInterval(() => {
    const now = Date.now();
    const sec = ((end - now) / 1000).toFixed(1);
    timerElem.innerHTML = `${sec}s`;

    if (sec <= 0) {
      clearInterval(interval);
    }
  }, 100);

  spells.forEach((spell) => {
    const { name, desc, event } = spell;
    const div = document.createElement('div');

    div.innerHTML = `
      <p>${name}</p>
      <p><em>${desc}</em></p>
    `;

    div.click(() => {
      const { player } = context.getState();

      if (player && player.spells.length < 4) {
        el.send('player:spell:select', { event });
      }
    });

    actionsElem.append(div);
  });

  el.subscribe('player:spells', (e) => {
    const { spells } = e.detail;

    playerActionsElem.innerHTML = '';

    spells.forEach((spell) => {
      const { name, event } = spell;
      const div = document.createElement('div');
      div.innerHTML = name;

      div.click(() => {
        el.send('player:spell:deselect', { event });
        div.remove();
      });

      playerActionsElem.append(div);
    });
  });

  el.subscribe('game:phase', () => {
    clearInterval(interval);
    el.navigate('/play');
  });

  el.click('#quit', () => {
    el.send('game:leave');
    el.navigate('/');
  });

  return el;
}

export default {
  path: '/plan',
  view: PlanView,
};
