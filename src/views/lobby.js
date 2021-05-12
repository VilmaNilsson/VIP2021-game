import { LobbyTeams } from '../components';

function LobbyView(context) {
  const el = document.createElement('div');
  el.id = 'lobbyWrapper';
  const { id, game } = context.getState();

  const name = game ? game.name : '';

  el.innerHTML = `
    <h1>Lobby: ${name}</h1>
    <h2>Join your team</h2>
    <div id="teams"></div>
    <div id="lobby-buttons-container" class="lobby-buttons">
      <button id="quit">Quit</button>
    </div>
  `;

  const teamsEl = el.querySelector('#teams');
  const quitEl = el.querySelector('#quit');

  LobbyTeams(teamsEl, context);

  // If you're the admin
  if (game && id === game.admin) {
    const startBtn = document.createElement('button');
    startBtn.id = 'startBtn';
    startBtn.textContent = 'Start';

    startBtn.addEventListener('click', () => {
      startBtn.send('game:start');
    });

    el.querySelector('#lobby-buttons-container').append(startBtn);
  }

  el.subscribe('player:reconnect', () => {
    const { id, game } = context.getState();

    LobbyTeams(teamsEl, context);

    // If you're the admin
    if (game && id === game.admin) {
      const startBtn = document.createElement('button');
      startBtn.id = 'startBtn';
      startBtn.textContent = 'Start';

      startBtn.addEventListener('click', () => {
        startBtn.send('game:start');
      });

      el.querySelector('#lobby-buttons-container').append(startBtn);
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
