import utils from '../utils';

// Render one player action
function renderPlayerAction(action) {
  const div = document.createElement('div');
  const { event, name, cooldown } = action;
  const m = utils.pad(Math.floor(cooldown / 60));
  const s = utils.pad(cooldown % 60);

  div.innerHTML = `
    <p class="aName">${action.name}</p>
    <p class="cooldown">${m}:${s}</p>
  `;

  // Don't make placeholders clickable
  if (name !== '-') {
    div.click(() => {
      div.send('player:action:deselect', { event });
      div.remove();
    });
  }

  return div;
}

function PlanPlayerActions(el, context) {
  const { player } = context.getState();

  if (!player) {
    return el;
  }

  // If the player has selected fewer then 2 actions we'll use these as visual
  // placeholders for now
  const placeholders = [
    { name: '-', cooldown: 0 },
    { name: '-', cooldown: 0 }
  ];

  // Initial rendering
  const { actions } = player;
  const paddedActions = actions.concat(placeholders).slice(0, 2);

  paddedActions.forEach((action) => {
    const actionEl = renderPlayerAction(action);
    el.append(actionEl);
  });

  // (De)selections rerender everything
  el.subscribe('player:actions', (e) => {
    const { actions } = e.detail;
    const paddedActions = actions.concat(placeholders).slice(0, 2);

    // Reset our current HTML
    el.innerHTML = '';

    paddedActions.forEach((action) => {
      const actionEl = renderPlayerAction(action);
      el.append(actionEl);
    });
  });
}

export default PlanPlayerActions;
