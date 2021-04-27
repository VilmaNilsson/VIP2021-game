function Actions(el, context) {
  const { player } = context.getState();

  // If there is no player in our state we cant render anything
  if (!player) {
    return el;
  }

  // Could possibly break out this into a function
  player.actions.forEach((action, actionIndex) => {
    const {
      name,
      event,
      target,
      cooldown,
      start,
    } = action;

    const div = document.createElement('div');

    // NOTE: We might need to calculate what time is left in order to reduce
    // risk for erros

    // The action is on cooldown
    if (start) {
      // NOTE: should cooldowns be stored in milliseconds instead?
      const end = start + (cooldown * 1000);
      const interval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);
        div.textContent = `${name} (${sec}s)`;

        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = `${name} (Cooldown ${cooldown}s)`;
        }
      }, 100);
    } else {
      // Otherwise display the standard text
      div.textContent = `${name} (Cooldown ${cooldown}s)`;
    }

    div.click(() => {
      const { action } = context.getState();

      // Cancel a active action thats about to be cast
      if (action !== null && action !== undefined) {
        context.setState({ action: null });
        div.publish('player:action:cancel');
        return;
      }

      // When they target themselves we dont need to select anything
      if (target === 'player') {
        context.setState({ action: null });
        div.send('player:action', { event, index: actionIndex });
      } else {
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

      const end = start + duration;

      const interval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);
        div.textContent = `${name} (${sec}s)`;

        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = `${name} (Cooldown ${cooldown}s)`;
        }
      }, 100);
    });

    el.append(div);
  });
}

export default Actions;
