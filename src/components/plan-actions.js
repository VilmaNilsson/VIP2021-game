import utils from "../utils";

function PlanActions(el, context) {
  const { game } = context.getState();

  if (!game) {
    return el;
  }

  const { actions } = game.phase;

  actions.forEach((action) => {
    const { name, desc, event, cooldown } = action;
    const div = document.createElement('div');
    div.setAttribute('class', 'availableAction');


    let m = utils.pad(Math.floor(cooldown / 60));
    let s = utils.pad(cooldown % 60);

    div.innerHTML = `
      <p class='aName'>${name}</p>
      <p>${desc}</p>
      <p class="cooldown">Cooldown(<span>${m}:${s}</span>)</p>
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
