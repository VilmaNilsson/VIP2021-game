function SecretCargo(el, context) {
  const { game, player } = context.getState();
  const secretCargoObj = document.getElementById('secret-cargo');
  const secretCargoSlot = document.getElementById('secret-cargo-slot');

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { secretCargo } = player;

  // Get the team-number of the player's team and use it to set the
  // background color of the element to the team's color
  const {teamNr} = player;
  secretCargoObj.style.backgroundColor = `var(--team-color-${teamNr})`;

  const token = tokens[secretCargo.token]
    ? tokens[secretCargo.token].name
    : '-';

  // TODO: check if the cargo is activated (then display that timer as well)
  el.textContent = `Secret: ${token}`;

  // Whenever we receive the changes to our cargo
  el.subscribe('player:cargos', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { secretCargo } = e.detail;

    const token = tokens[secretCargo.token]
      ? tokens[secretCargo.token].name
      : '-';

    secretCargoSlot.src = `../../assets/${token}.png`;
  });

  el.click(() => {
    const state = context.getState();

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

    // Update our client state with our selection
    context.setState({ tokenSelection: state.tokenSelection });
  });

  // Whenever someone plays the activate secret cargo action
  el.subscribe('action:player:secret-cargo', (e) => {
    const { start, duration } = e.detail;
    // The end time (ie. 'that many seconds far ahead')
    const end = start + duration;
    timerCaller();

    const interval = context.setInterval(() => {
      const { game, player } = context.getState();
      const { tokens } = game;
      const { secretCargo } = player;

      // First get our current token
      const token = tokens[secretCargo.token]
        ? tokens[secretCargo.token].name
        : '-';

      // We take a timestamp ('now' in seconds)
      const now = Date.now();
      // Calculate how many seconds are left
      const sec = ((end - now) / 1000).toFixed(1);

      // If none are, stop our interval
      if (sec <= 0) {
        clearInterval(interval);
        secretCargoSlot.src = `../../assets/${token}.png`;
      }
    }, 100);
  });

  function timerCaller() {
    const minSpan = document.querySelector('#secret-cargo-timer > span:first-of-type');
    minSpan.innerHTML = '02';

    const secSpan = document.querySelector('#secret-cargo-timer > span:last-of-type');
    secSpan.innerHTML = '00';

    let secID = setInterval(() => {
        timeSec();
    }, 500);

    setTimeout(() => {
        clearInterval(secID);
    }, 60500);
  }

  function timeSec() {
      const secSpan = document.querySelector('#secret-cargo-timer > span:last-of-type');
      let secVal = secSpan.innerHTML;

      if (secVal == '00' || secVal == '0') {
          const minSpan = document.querySelector('#secret-cargo-timer > span:first-of-type');
          let minVal = minSpan.innerHTML;
          minVal--;
          minSpan.innerHTML = ('0' + minVal).slice(-2);
          secSpan.innerHTML = '59';
      } else {
          secVal--;
          secSpan.innerHTML = ('0' + secVal).slice(-2);
      }
  }
  return el;
}

export default SecretCargo;
