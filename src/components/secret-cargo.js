function SecretCargo(el, context) {
  const { game, player } = context.getState();
  const secretCargoSlot = el.getElementById("secret-cargo-slot");
  const secretCargoTimer = el.getElementById("secret-cargo-timer");

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { secretCargo } = player;

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

    secretCargoSlot.src = token;
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
      secretCargoTimer.textContent = sec;

      // If none are, stop our interval
      if (sec <= 0) {
        clearInterval(interval);
        secretCargoSlot.src = token;
      }
    }, 100);
  });

  return el;
}

export default SecretCargo;
