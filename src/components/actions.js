function Actions(el, context) {
  const { player } = context.getState();

  // If there is no player in our state we cant render anything
  if (!player) {
    return el;
  }

  // Could possibly break out this into a function
  player.spells.forEach((spell, spellIndex) => {
    const { name, event, target, cooldown, start } = spell;
    const div = document.createElement('div');

    const now = Date.now();
    const end = start + (cooldown * 1000);

    // The spell is on cooldown
    if (end > 0) {
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
      const { spell } = context.getState();

      // Cancel a active spell thats about to be cast
      if (spell !== null && spell !== undefined) {
        context.setState({ spell: null });
        div.publish('player:spell:cancel');
        return;
      }

      // When they target themselves we dont need to select anything
      if (target === 'player') {
        context.setState({ spell: null });
        div.send('player:spell', { event, index: spellIndex });
      } else {
        context.setState({ spell: { event, index: spellIndex }});
        div.publish(`player:spell:${target}`);
      }
    });

    div.subscribe('player:spell:cooldown', (e) => {
      const { index, start, duration } = e.detail;

      // Not this spell
      if (spellIndex !== index) {
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
