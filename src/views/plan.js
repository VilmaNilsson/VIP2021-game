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
      <div id='rocketBox'><div class='rocket one'>000</div><div class='rocket two'>000</div><div class='rocket three'>000</div><div class='rocket four'>000</div></div>
      <div id="timer"></div>
    </div>
    <div id="actions">
      <div class='availableAction'><div class='actionName'>Secret</div><br><div class='actionCooldown'>Cooldown 30s</div><br><div class='actionInfo'>Blablalbblbla</div></div>
      <div class='availableAction'> - </div>
      <div class='availableAction'> - </div>
      <div class='availableAction'> - </div>
      <div class='availableAction'> - </div>
      <div class='availableAction'> - </div>
      <div class='availableAction'> - </div>
      <div class='availableAction'> - </div>
    </div>
    <div id="player-actions">
      <div class='chosenAction'> - </div>
      <div class='chosenAction'> - </div>
      <div class='chosenAction'> - </div>
      <div class='chosenAction'> - </div>
    </div>
  `;

  const timerEl = el.querySelector('#timer');
  const actionsEl = el.querySelector('#actions');
  const playerActionsEl = el.querySelector('#player-actions');
  const availableAction = el.querySelectorAll('.availableAction');
  console.log(availableAction);
  availableAction.forEach(function(thisAction){
    console.log(thisAction)
    thisAction.addEventListener('click', function(){
      console.log(this.childNodes[0].innerHTML)
    })
  })

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
