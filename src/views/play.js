import {
  Teams,
  PlayTimer,
  Stations,
  Pocket,
  TemporaryPocket,
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
    <h2>Pockets</h2>
    <div id="pocket"></div>
    <div id="temporary-pocket"></div>
    <h3>Your actions</h3>
    <div id="actions"></div>
    <button id="quit">Quit</button>
  `;

  function renderAll() {
    // Render all of our components
    PlayTimer(el.querySelector('#timer'), context);
    Teams(el.querySelector('#teams'), context);
    Stations(el.querySelector('#stations'), context);
    Racks(el.querySelector('#racks'), context);
    Pocket(el.querySelector('#pocket'), context);
    TemporaryPocket(el.querySelector('#temporary-pocket'), context);
    Actions(el.querySelector('#actions'), context);
  }

  renderAll();

  // We have to rerender them when e player reconnects
  el.subscribe('player:reconnect', (e) => {
    renderAll();
  });

  // Super simple "Game Over" view
  el.subscribe('game:phase', () => {
    const { game } = context.getState();
    const scores = game.teams.map((t) => t.score);
    scores.sort().reverse();

    el.innerHTML = `
      <h1>Game over</h1>
      <h2>Scores</h2>
      <div>
        ${scores.map((s, i) => `Team ${i + 1}: ${s}`).join('<br>')}
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

