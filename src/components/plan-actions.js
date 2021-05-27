import utils from "../utils";

function PlanActions(el, context) {
  const { game } = context.getState();

  if (!game) {
    return el;
  }

  const actions = game.phase.actions || [];

  actions.forEach((action) => {
    const { name, desc, event, cooldown } = action;

    const div = document.createElement('div');
    div.className = 'availableAction';

    const m = utils.pad(Math.floor(cooldown / 60));
    const s = utils.pad(cooldown % 60);

    div.innerHTML = `
      <p class="aName">${name}</p>
      <p class="desc">${desc}</p>
      <p class="cooldown">Cooldown: <span>${m}:${s}</span></p>
    `;

    div.click(() => {
      const { player } = context.getState();

      // Can only select 2 actions (the server wouldnt accept it anyway)
      if (player && player.actions.length < 2) {
        div.send('player:action:select', { event });
      }
    });

    el.append(div);
  });
}

export default PlanActions;
