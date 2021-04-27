import {
  Teams,
  PlayTimer,
  Stations,
  Cargo,
  SecretCargo,
  Actions,
  Racks,
} from '../components';

function PlayView(context) {
  const el = document.createElement('div');

  el.innerHTML = `
    <h1>Play</h1>
    <div id="timer"></div>
    <h2>Teams</h2>
    <div id="teams"></div>
    <h2>Stations</h2>
    <div id="stations"></div>
    <h2>Racks</h2>
    <div id="racks"></div>
    <h2>Cargo</h2>
    <div id="cargo"></div>
    <div id="secret-cargo"></div>
    <h3>Your actions</h3>
    <div id="actions"></div>
    <button id="quit">Quit</button>
  `;

  const timerEl = el.querySelector('#timer');
  const teamsEl = el.querySelector('#teams');
  const stationsEl = el.querySelector('#stations');
  const racksEl = el.querySelector('#racks');
  const cargoEl = el.querySelector('#cargo');
  const secretCargoEl = el.querySelector('#secret-cargo');
  const actionsEl = el.querySelector('#actions');

  // Render all of our components
  PlayTimer(timerEl, context);
  Teams(teamsEl, context);
  Stations(stationsEl, context);
  Racks(racksEl, context);
  Cargo(cargoEl, context);
  SecretCargo(secretCargoEl, context);
  Actions(actionsEl, context);

  // We have to rerender them when e player reconnects
  el.subscribe('player:reconnect', () => {
    PlayTimer(timerEl, context);
    Teams(teamsEl, context);
    Stations(stationsEl, context);
    Racks(racksEl, context);
    Cargo(cargoEl, context);
    SecretCargo(secretCargoEl, context);
    Actions(actionsEl, context);
  });

  // Super simple "Game Over" view
  el.subscribe('game:phase', () => {
    const { game } = context.getState();
    game.teams.sort((a, b) => a.score - b.score);

    el.innerHTML = `
      <h1>Game over</h1>
      <h2>Scores</h2>
      <div>
        ${game.teams.map((team) => `${team.name}: ${team.score}`).join('<br>')}
      </div>
      <button id="leave">Leave</button>
    `;

    el.click('#leave', () => {
      el.navigate('/');
    });
  });

  el.click('#quit', () => {
    el.send('game:leave');
    el.navigate('/');
  });

  return el;
}

export default {
  path: '/play',
  view: PlayView,
};
