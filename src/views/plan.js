console.log('hej')

import {
  PlanTimer,
  PlanActions,
  PlanPlayerActions,
} from '../components';

function PlanView(context) {
  const el = document.createElement('div');
  el.setAttribute('class', 'planWrapper');

  el.innerHTML = `
    <div id='controlPanel'>
      <div id='rocketBox'><div class='rocket'>Rocket</div><div class='rocket'>Rocket</div><div class='rocket'>Rocket</div><div class='rocket'>Rocket</div></div>
      <div id="timer"></div>
    </div>
    <div id="actions"></div>
    <div id="player-actions">
      <div class='chosenAction'>chosen Action</div>
      <div class='chosenAction'>chosen Action</div>
      <div class='chosenAction'>chosen Action</div>
      <div class='chosenAction'>chosen Action</div>
    </div>
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

  

  return el;
}

export default {
  path: '/plan',
  view: PlanView,
};
