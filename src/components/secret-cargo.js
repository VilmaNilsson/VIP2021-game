import utils from '../utils';

function SecretCargo(el, context) {
  const { game, player } = context.getState();

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  // Get the team-number of the player's team and use it to set the
  // background color of the element to the team's color
  const { tokens, teams } = game;
  const { secretCargo, team } = player;
  const token = tokens[secretCargo.token] ? tokens[secretCargo.token].name : '-';

  el.innerHTML = `
    <div class="token">
      <img src="/assets/${token}.png">
    </div>
    <div class="timer">
      02:00
    </div>
  `;

  const img = el.querySelector('img');
  const timerEl = el.querySelector('.timer');

  const teamColor = teams[team].color;

  el.style.backgroundColor = teamColor;

  if (secretCargo.locked) {
    el.classList.add('locked');
  } else {
    const { start, duration } = secretCargo;

    if (start && duration) {
      context.setInterval({
        start,
        duration,
        onTick: (time) => {
          const m = utils.pad(time.minutes);
          const s = utils.pad(time.seconds);
          timerEl.textContent = `${m}:${s}`;
          el.classList.remove('locked');
        },
        onEnd: () => {
          timerEl.textContent = '02:00';
          el.classList.add('locked');
        },
      });
    }
  }

  // TODO: check if the cargo is activated (then display that timer as well)

  // Whenever we receive the changes to our cargo
  el.subscribe('player:cargos', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { secretCargo } = e.detail;

    const token = tokens[secretCargo.token]
      ? tokens[secretCargo.token].name
      : '-';

    img.src = `/assets/${token}.png`;
    el.classList.remove('selected');
  });

  el.click(() => {
    const state = context.getState();

    // Dont do anything if the secret cargo is locked
    if (state.player && state.player.secretCargo.locked) {
      return;
    }

    // If nothing is in our cargo
    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the cargo
      state.tokenSelection = 'secret-cargo';
    } else if (state.tokenSelection === 'secret-cargo') {
      // Deselect
      state.tokenSelection = null;
    // If something is in our cargo
    } else {
      // Otherwise perform a swap
      const to = 'secret-cargo';
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    // Visuals for (de)selecting
    if (state.tokenSelection === null) {
      el.classList.remove('selected');
    } else {
      el.classList.add('selected');
    }

    // Update our client state with our selection
    context.setState({ tokenSelection: state.tokenSelection });
  });

  // Whenever someone plays the activate secret cargo action
  el.subscribe('action:player:secret-cargo', (e) => {
    const { start, duration } = e.detail;

    const { player } = context.getState();
    player.secretCargo.locked = false;
    context.setState({ player });

    context.setInterval({
      start,
      duration,
      onTick: (time) => {
        const m = utils.pad(time.minutes);
        const s = utils.pad(time.seconds);
        timerEl.textContent = `${m}:${s}`;
        el.classList.remove('locked');
      },
      onEnd: () => {
        timerEl.textContent = '02:00';
        el.classList.add('locked');
      },
    });
  });

  // Whenever the active cargo action fades
  el.subscribe('action:player:secret-cargo:faded', () => {
    el.classList.add('locked');
  });

  return el;
}

export default SecretCargo;
