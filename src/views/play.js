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
      <button id="menu">Quit</button>
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
    // const c = game.teams[player.team].color;
    const c = getComputedStyle(document.documentElement).getPropertyValue(`--team-color-${player.team + 1}`);
    document.documentElement.style.setProperty('--your-team-color', c);
    document.documentElement.style.setProperty('--your-team-color-alpha', c + '40');
    document.documentElement.style.setProperty('--your-team-color-dark', utils.shadeColor(c, -30));
  }

  // We have to rerender them when e player reconnects
  el.subscribe('player:reconnect', () => {
    const { game, player } = context.getState();

    if (game && player) {
      const c = getComputedStyle(document.documentElement).getPropertyValue(`--team-color-${player.team + 1}`);
      document.documentElement.style.setProperty('--your-team-color', c);
    document.documentElement.style.setProperty('--your-team-color-alpha', c + '40');
      document.documentElement.style.setProperty('--your-team-color-dark', utils.shadeColor(c, -30));
    }

    Teams(teamsEl, context);
    Stations(stationsEl, context);
    Racks(racksEl, context);
    Cargo(cargoEl, context);
    SecretCargo(secretCargoEl, context);
    Actions(actionsEl, context);
  });

  el.click('#menu', () => {
    if (window.confirm('Are you sure?')) {
      el.send('game:leave');
      el.navigate('/');
    }
  });

  // Super simple "Game Over" view
  el.subscribe('game:over', (e) => {
    const { teams } = e.detail;

    const ts = teams
      .map((team, i) => {
        return {
          score: team.score,
          html: `
            <div class="team-score team-${i + 1}">
              <span class="points">${team.score}</span>
            </div>
          `
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((team) => team.html)
      .join('');

    // TODO: highlight your own team
    el.innerHTML = `
      <div id="game-over">
        <h1>Game Over</h1>
        <h3>Team Scores</h3>
        <div class="team-scores">${ts}</div>
        <button id="leave">Exit</button>
      </div>
    `;

    el.click('#leave', () => {
      el.navigate('/');
    });
  });

  return el;
}

export default {
  path: '/play',
  view: PlayView,
};
