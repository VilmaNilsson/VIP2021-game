import {
  Teams,
  PlanTimer,
  PlanActions,
  PlanPlayerActions,
} from '../components';

function PlanView(context) {
  const el = document.createElement('div');
  el.id = 'plan-view';

  el.innerHTML = `
    <div id="teams"></div>
    <div id="timer"></div>
    <div id="available-actions">Choose your Actions for this Game</div>
    <div id="actions"></div>
    <div id="your-actions">Your Actions (tap to remove)</div>
    <div id="player-actions"></div>
  `;

  const { game, player } = context.getState();

  if (game && player) {
    const c = getComputedStyle(document.documentElement).getPropertyValue(`--team-color-${player.team + 1}`);
    document.documentElement.style.setProperty('--your-team-color', c);
    document.documentElement.style.setProperty('--your-team-color-alpha', c + '40');
  }

  const teamsEl = el.querySelector('#teams');
  const timerEl = el.querySelector('#timer');
  const actionsEl = el.querySelector('#actions');
  const playerActionsEl = el.querySelector('#player-actions');

  Teams(teamsEl, context);
  PlanTimer(timerEl, context);
  PlanActions(actionsEl, context);
  PlanPlayerActions(playerActionsEl, context);

  // Position background to get crosshair on timer
  // Need to wait until timer is in place and has content
  let intervalID = context.setInterval(() => {
    let timerEl = document.querySelector("#timer");
    if (timerEl && timerEl.innerHTML) {
      let timerBox = timerEl.getBoundingClientRect();
      let _y = timerBox.y + timerBox.height / 2;
      let vw = parseInt(getComputedStyle(document.documentElement).getPropertyValue("width")); // in px
      let posy = -190 * (vw / 910) + _y;
      el.style.backgroundPositionY = `${posy}px`;
      clearInterval(intervalID);
    }
  }, 30);

  if (game && player) {
    const teamIndex = player.team;
    const teamEl = el.querySelector(`#teams .team:nth-child(${teamIndex + 1})`);
    if (teamEl) {
      teamEl.classList.add('your-team');
    }
  }

  el.subscribe('player:reconnect', () => {
    const { game, player } = context.getState();

    if (game && player) {
      const c = getComputedStyle(document.documentElement).getPropertyValue(`--team-color-${player.team + 1}`);
      document.documentElement.style.setProperty('--your-team-color', c);
      document.documentElement.style.setProperty('--your-team-color-alpha', c + '40');
    }

    Teams(teamsEl, context);
    PlanTimer(timerEl, context);
    PlanActions(actionsEl, context);
    PlanPlayerActions(playerActionsEl, context);

    if (game && player) {
      const teamIndex = player.team;
      const teamEl = el.querySelector(`#teams .team:nth-child(${teamIndex + 1})`);

      if (teamEl) {
        teamEl.classList.add('your-team');
      }
    }
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
