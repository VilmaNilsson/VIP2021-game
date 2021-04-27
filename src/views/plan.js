import {
  PlanTimer,
  PlanActions,
  PlanPlayerActions,
} from '../components';

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

  const timerEl = el.querySelector('#timer');
  const actionsEl = el.querySelector('#actions');
  const playerActionsEl = el.querySelector('#player-actions');

  // NOTE: we should probably create a `PlanTimer` if their looks differ
  PlanTimer(timerEl, context);
  PlanActions(actionsEl, context);
  PlanPlayerActions(playerActionsEl, context);

  el.subscribe('player:reconnect', () => {
    PlanTimer(timerEl, context);
    PlanActions(actionsEl, context);
    PlanPlayerActions(playerActionsEl, context);
  });

  el.subscribe('game:phase', () => {
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
