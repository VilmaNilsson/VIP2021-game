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
      <div id='rocketBox'>
        <div class='rocketDiv lBlue'></div>
        <div class='rocketDiv pink'></div>
        <div class='rocketDiv purple'></div>
        <div class='rocketDiv dBlue'></div>
      </div>
      <div id="timer"></div>
    </div>
    <div id="actions"></div>
    <div id="player-actions"></div>
  `;

  const { player } = context.getState();
  console.log(player.team);

  // Get the rocket divs
  const controlPanel = el.querySelector('#controlPanel');
  const rocketBox = controlPanel.querySelector('#rocketBox');
  const lBlue = rocketBox.querySelector('.lBlue');
  const pink = rocketBox.querySelector('.pink');
  const purple = rocketBox.querySelector('.purple');
  const dBlue = rocketBox.querySelector('.dBlue');
  if (player.team === 0) {
    lBlue.classList.add('yourTeam');
  } else if (player.team === 1) {
    pink.classList.add('yourTeam');
  } else if (player.team === 2) {
    purple.classList.add('yourTeam');
  } else if (player.team === 3) {
    dBlue.classList.add('yourTeam');
  }

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
