function PlanActions(el, context) {
  const { game } = context.getState();

  if (!game) {
    return el;
  }

  const { spells } = game.phase;

  spells.forEach((spell) => {
    const { name, desc, event } = spell;
    const div = document.createElement('div');

    div.innerHTML = `
      <p>${name}</p>
      <p><em>${desc}</em></p>
    `;

    div.click(() => {
      const { player } = context.getState();

      // Can only select 4 spells (the server wouldnt accept it anyway)
      if (player && player.spells.length < 4) {
        div.send('player:spell:select', { event });
      }
    });

    el.append(div);
  });
}

export default PlanActions;
