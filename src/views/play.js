import utils from '../utils';
import {
  Teams,
  Stations,
  Cargo,
  SecretCargo,
  Actions,
  Racks,
} from '../components';

function PlayView(context) {
  const el = document.createElement('div');
  el.id = 'play-view';

  el.innerHTML = `
    <div id="teams"></div>
    <div id="stations"></div>
    <div id="racks"></div>
    <div id="bottom">
      <div id="actions"></div>
      <div id="cargo-container">
        <div id="cargo"></div>
        <div id="secret-cargo"></div>
      </div>
    </div>
    <div id="misc">
      <button id="menu">Menu</button>
    </div>
  `;

  // const timerEl = el.querySelector('#timer');
  const teamsEl = el.querySelector('#teams');
  const stationsEl = el.querySelector('#stations');
  const racksEl = el.querySelector('#racks');
  const cargoEl = el.querySelector('#cargo');
  const secretCargoEl = el.querySelector('#secret-cargo');
  const actionsEl = el.querySelector('#actions');

  // Render all of our components
  Teams(teamsEl, context);
  Stations(stationsEl, context);
  Racks(racksEl, context);
  Cargo(cargoEl, context);
  SecretCargo(secretCargoEl, context);
  Actions(actionsEl, context);

  const { game, player } = context.getState();

  if (game && player) {
    const c = game.teams[player.team].color;
    document.documentElement.style.setProperty('--your-team-color', c);
    document.documentElement.style.setProperty('--your-team-color-bright', utils.increaseBrightness(c, 50));
  }

  // We have to rerender them when e player reconnects
  el.subscribe('player:reconnect', () => {
    const { game, player } = context.getState();

    if (game && player) {
      const c = game.teams[player.team].color;
      document.documentElement.style.setProperty('--your-team-color', c);
      document.documentElement.style.setProperty('--your-team-color-bright', utils.increaseBrightness(c, 50));
    }

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

  // el.click('#quit', () => {
  //   el.send('game:leave');
  //   el.navigate('/');
  // });

  // el.click('#menu', () => {
  //   console.log('You pressed the menu button');
  // });
  return el;
}

export default {
  path: '/play',
  view: PlayView,
};
