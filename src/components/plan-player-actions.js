import utils from "../utils";

function PlanPlayerActions(el, context) {
  const { player } = context.getState();

  if (!player) {
    return el;
  }

  const { actions } = player;
  renderActions(actions);

  // When actions are added
  el.subscribe('player:actions', (e) => {
    // The new array of the chosen actions
    const { actions } = e.detail;
    renderActions(actions);
  });

  function renderActions (_actions) {
    
    el.innerHTML = '';

    // Chosen and Empty actions
    // NOTE: Should we connect this max number of actions with the server side?
    for (let i = 0; i < 2; i++) {


      const div = document.createElement('div');

      let action = _actions[i] || {name: "-", cooldown: 0};
      let m = utils.pad(Math.floor(action.cooldown / 60));
      let s = utils.pad(action.cooldown % 60);

      div.innerHTML = `
        <p class="aName">${action.name}</p>
        <p class="cooldown">${m}:${s}</p>
      `;

      if (action.event) {
        div.click(() => {
          setTimeout(() => {
            div.send('player:action:deselect', { event: action.event });
            div.remove();
          }, 300);
        });
      } 

      el.append(div)

    }

  }

  // // Render initial actions
  // actions.forEach((action) => {
  //   const { name, event } = action;
  //   const div = document.createElement('div');
  //   div.innerHTML = name;

  //   div.click(() => {
  //     setTimeout(() => {
  //       div.send('player:action:deselect', { event });
  //       div.remove();
  //     }, 300);
  //   });

  //   el.append(div);
  // });
  // When actions are added

  // el.subscribe('player:actions', (e) => {
  //   // The new array of the chosen actions
  //   const { actions } = e.detail;
  //   // Clear out all the old ones
  //   el.innerHTML = '';

  //   // Re-render all of the player actions
  //   actions.forEach((action) => {
  //     const { name, event } = action;
  //     const div = document.createElement('div');
  //     div.innerHTML = name;

  //     div.click(() => {
  //       setTimeout(() => {
  //         div.send('player:action:deselect', { event });
  //         div.remove();
  //       }, 300);
  //     });

  //     el.append(div);
  //   });
  // });

}

export default PlanPlayerActions;
