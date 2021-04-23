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

  const teamsList = el.querySelector('#teams');
  
  // TODO: show error for admin? everyone needs to join a game

  state.game.teams.forEach((team, index) => {
    const teamEl = document.createElement('div');
    teamsList.append(LobbyTeam(teamEl, team.name, index));
  });

  // If you're the admin
  if (state.id === state.game.admin) {
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    // TODO: 5sec countdown
    startBtn.addEventListener('click', () => startBtn.send('game:start'));
    el.append(startBtn);
  }

  el.subscribe('game:phase', () => {
    el.navigate('/plan');
  });

  el.querySelector('#quit').addEventListener('click', () => {
    el.send('game:leave');
    el.navigate('/');
  });

  return el;
}

export default {
  path: '/lobby',
  view: LobbyView
};
