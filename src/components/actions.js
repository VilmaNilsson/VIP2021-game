const CONVERT_MINUTES = 60;
const CONVERT_SECONDS = 60;

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
    el.classList.add('game-action-bar');
    div.classList.add('game-action-button');

    let cdMinutes = Math.floor(cooldown / CONVERT_MINUTES);
    let cdSec = cooldown - (cdMinutes * CONVERT_SECONDS);

    if (cdSec === 60) {
      cdSec = 0;
    }

    let convertedCooldown;
    if (cdSec === 0) {
      convertedCooldown = `0${cdMinutes}:0${cdSec}`;
    } else {
      convertedCooldown = `0${cdMinutes}:${cdSec}`;
    }

    let canBeCanceled = true;

    // NOTE: We might need to calculate what time is left in order to reduce
    // risk for erros

    // The action is on cooldown
    if (start) {
      // NOTE: should cooldowns be stored in milliseconds instead?
      const end = start + (cooldown * 1000);
      div.classList.add('game-action-on-cooldown');
      canBeCanceled = false;

      cdMinutes -= 1;

      const interval = context.setInterval(() => {
        const now = Date.now();
        let sec = ((end - now) / 1000).toFixed(0);
        sec = sec - cdMinutes * CONVERT_SECONDS - 1;
        if (sec < 10) div.innerHTML = `<span>${name}</span> <span>0${cdMinutes}:0${sec}</span>`;
        else div.innerHTML = `<span>${name}</span> <span>0${cdMinutes}:${sec}</span>`;
        if (sec <= 0) cdMinutes -= 1;

        if (cdMinutes < 0) {
          if (sec <= 0) {
            clearInterval(interval);
            canBeCanceled = true;
            div.classList.remove('game-action-on-cooldown');
            cdMinutes = cooldown / CONVERT_MINUTES;
            div.innerHTML = `<span>${name}</span> <span>${convertedCooldown}</span>`;
          }
        }
      }, 1000);
    } else {
      // Otherwise display the standard text
      div.innerHTML = `<span>${name}</span> <span>${convertedCooldown}</span>`;
    }

    div.click(() => {
      const { action } = context.getState();

      const otherSelectedAction = document.querySelector('.game-action-selected');
      if (otherSelectedAction) otherSelectedAction.classList.remove('game-action-selected');

      // Cancel a active action thats about to be cast
      if (action !== null && action !== undefined) {
        div.classList.remove('game-action-selected');
        context.setState({ action: null });
        div.publish('player:action:cancel');
        return;
      }
      if (canBeCanceled) div.classList.add('game-action-selected');

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
      div.classList.remove('game-action-selected');
      div.classList.add('game-action-on-cooldown');
      canBeCanceled = false;

      const end = start + duration;
      cdMinutes -= 1;
      const interval = context.setInterval(() => {
        const now = Date.now();
        let sec = ((end - now) / 1000).toFixed(0);
        sec = sec - cdMinutes * CONVERT_SECONDS - 1;
        if (sec < 10) div.innerHTML = `<span>${name}</span> <span>0${cdMinutes}:0${sec}</span>`;
        else div.innerHTML = `<span>${name}</span> <span>0${cdMinutes}:${sec}</span>`;
        if (sec <= 0) cdMinutes -= 1;
        if (cdMinutes < 0) {
          if (sec <= 0) {
            clearInterval(interval);
            canBeCanceled = true;
            div.classList.remove('game-action-on-cooldown');
            cdMinutes = cooldown / CONVERT_MINUTES;
            div.innerHTML = `<span>${name}</span> <span>${convertedCooldown}</span>`;
          }
        }
      }, 1000);
    });

    el.append(div);
  });
}

export default Actions;
