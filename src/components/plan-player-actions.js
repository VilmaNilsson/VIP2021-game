function PlanPlayerActions(el, context) {
  const { player } = context.getState();

  if (!player) {
    return el;
  }

  const { actions } = player;

  // Render initial actions
  actions.forEach((action) => {
    const { name, event } = action;
    const div = document.createElement('div');
    div.innerHTML = name;

    div.click(() => {
      setTimeout(() => {
        div.send('player:action:deselect', { event });
        div.remove();
      }, 300);
    });

    el.append(div);
  });

  // When actions are added
  el.subscribe('player:actions', (e) => {
    // The new array of the chosen actions
    const { actions } = e.detail;
    // Clear out all the old ones
    el.innerHTML = '';

    // Re-render all of the player actions
    actions.forEach((action) => {
      const { name, event } = action;
      const div = document.createElement('div');
      div.innerHTML = name;

      div.click(() => {
        setTimeout(() => {
          div.send('player:action:deselect', { event });
          div.remove();
        }, 300);
      });

      el.append(div);
    });
  });
}

export default PlanPlayerActions;
