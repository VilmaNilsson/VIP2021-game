function PlanActions(el, context) {
  const { game } = context.getState();

  if (!game) {
    return el;
  }

  const { actions } = game.phase;

  actions.forEach((action) => {
    const { name, desc, event } = action;
    const div = document.createElement('div');

    div.innerHTML = `
      <p>${name}</p>
      <p><em>${desc}</em></p>
    `;

    div.click(() => {
      const { player } = context.getState();

      // Can only select 4 actions (the server wouldnt accept it anyway)
      if (player && player.actions.length < 4) {
        div.send('player:action:select', { event });
      }
    });

    el.append(div);
  });
}

export default PlanActions;
