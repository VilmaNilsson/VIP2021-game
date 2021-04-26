import { LobbyTeam } from '../components';

function LobbyView(context) {
  const el = document.createElement('div');
  const state = context.getState();

  el.innerHTML = `
    <h1>Lobby: ${state.game.name}</h1>
    <h2>Teams</h2>
    <div id="teams"></div>
    <button id="quit">Quit</button>
  `;

  const teamsEl = el.querySelector('#teams');
  const quitEl = el.querySelector('#quit');
  
  state.game.teams.forEach((team, index) => {
    const teamEl = document.createElement('div');
    teamsEl.append(LobbyTeam(teamEl, team.name, index));
  });

  // If you're the admin
  if (state.id === state.game.admin) {
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';

    startBtn.addEventListener('click', () => {
      startBtn.send('game:start');
    });

    el.append(startBtn);
  }

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
  view: LobbyView
};
