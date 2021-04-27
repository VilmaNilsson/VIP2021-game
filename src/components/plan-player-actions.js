function PlanPlayerActions(el, context) {
  const { player } = context.getState();

  if (!player) {
    return el;
  }

  const { spells } = player;

  // Render initial spells
  spells.forEach((spell) => {
    const { name, event } = spell;
    const div = document.createElement('div');
    div.innerHTML = name;

    div.click(() => {
      div.send('player:spell:deselect', { event });
      div.remove();
    });

    el.append(div);
  });

  // When spells are added
  el.subscribe('player:spells', (e) => {
    // The new array of the chosen spells
    const { spells } = e.detail;
    // Clear out all the old ones
    el.innerHTML = '';

    // Re-render all of the player spells
    spells.forEach((spell) => {
      const { name, event } = spell;
      const div = document.createElement('div');
      div.innerHTML = name;

      div.click(() => {
        div.send('player:spell:deselect', { event });
        div.remove();
      });

      el.append(div);
    });
  });
}

export default PlanPlayerActions;
