import { LobbyTeams } from '../components';

function LobbyView(context) {
  const el = document.createElement('div');
  const { id, game } = context.getState();

  const name = game ? game.name : '';

  el.innerHTML = `
    <h1>Lobby: ${name}</h1>
    <h2>Teams</h2>
    <div id="teams"></div>
    <button id="quit">Quit</button>
  `;

  const teamsEl = el.querySelector('#teams');
  const quitEl = el.querySelector('#quit');

  LobbyTeams(teamsEl, context);

  // If you're the admin
  if (game && id === game.admin) {
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';

    startBtn.addEventListener('click', () => {
      startBtn.send('game:start');
    });

    el.append(startBtn);
  }

  el.subscribe('player:reconnect', () => {
    const { id, game } = context.getState();

    LobbyTeams(teamsEl, context);

    // If you're the admin
    if (game && id === game.admin) {
      const startBtn = document.createElement('button');
      startBtn.textContent = 'Start';

      startBtn.addEventListener('click', () => {
        startBtn.send('game:start');
      });

      el.append(startBtn);
    }
  });

  el.subscribe('game:start:fail', () => {
    el.querySelector('h2').textContent = 'Teams (everyone needs to join a team)';
  });

  el.subscribe('game:phase', () => {
    el.navigate('/plan');
  });

  quitEl.addEventListener('click', () => {
    el.send('game:leave');
    el.navigate('/');
  });

  return el;
}

export default {
  path: '/lobby',
  view: LobbyView,
};
