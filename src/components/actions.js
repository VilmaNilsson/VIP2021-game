import utils from '../utils';

function Actions(el, context) {
  const { player } = context.getState();

  // If there is no player in our state we cant render anything
  if (!player) {
    return el;
  }

  // Could possibly break out this into a function
  player.actions.forEach((action, actionIndex) => {
    const { name, event, target, cooldown, start, } = action;
    // Milliseconds
    const duration = cooldown * 1000;

    const div = document.createElement('div');
    div.className = 'action';

    const secs = cooldown % 60;
    const mins = (cooldown - secs) / 60;
    // Original cooldown time
    const cooldownTime = `${utils.pad(mins)}:${utils.pad(secs)}`;

    div.innerHTML = `
      <div class="name">${name}</div>
      <div class="cooldown">${cooldownTime}</div>
    `;

    const cdEl = div.querySelector('.cooldown');

    let onCooldown = false;

    // The action is already on cooldown (upon initial render)
    if (start) {
      div.classList.add('on-cooldown');
      onCooldown = true;

      context.setInterval({
        start,
        duration,
        onTick: (time) => {
          const m = utils.pad(time.minutes);
          const s = utils.pad(time.seconds);
          cdEl.textContent = `${m}:${s}`;
        },
        onEnd: () => {
          cdEl.textContent = `${cooldownTime}`;
          onCooldown = false;
          div.classList.remove('on-cooldown');
        },
      });
    }

    div.click(() => {
      if (onCooldown) {
        return;
      }

      const { action } = context.getState();
      // Save previous selections
      const otherSelectedActions = el.querySelectorAll('.selected');
      // Select this action
      div.classList.add('selected');

      // Another action is already selected
      if (action !== null && action !== undefined) {
        // First unset the current one
        context.setState({ action: null });
        div.publish('player:action:cancel');

        // If they clicked the same action twice
        if (action.index === actionIndex) {
          // We'll deselect it
          div.classList.remove('selected');
          return;
        }
      }

      // Clear previous selections
      if (otherSelectedActions) {
        Array.from(otherSelectedActions).forEach((a) => {
          a.classList.remove('selected');
        });
      }

      // Some actions affect all entities (or yourself) of some sort, in that
      // case we'll activate the action immediately
      if (['player', 'stations', 'teams'].includes(target)) {
        context.setState({ action: null });
        div.send('player:action', { event, index: actionIndex });
        div.classList.remove('selected');
      } else {
        // Otherwise we'll pass on the action to the entity to handle it further
        context.setState({ action: { event, index: actionIndex } });
        div.publish(`player:action:${target}`);
      }
    });

    div.subscribe('player:action:cooldown', (e) => {
      const { index, start, duration } = e.detail;

      // Not this action
      if (actionIndex !== index) {
        return;
      }

      div.classList.remove('selected');
      div.classList.add('on-cooldown');
      onCooldown = true;

      context.setInterval({
        start,
        duration,
        onTick: (time) => {
          const m = utils.pad(time.minutes);
          const s = utils.pad(time.seconds);
          cdEl.textContent = `${m}:${s}`;
        },
        onEnd: () => {
          cdEl.textContent = `${cooldownTime}`;
          div.classList.remove('on-cooldown');
          onCooldown = false;
        },
      });
    });

    el.append(div);
  });
}

export default Actions;
