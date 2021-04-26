function TemporaryPocket(el, context) {
  const { game, player } = context.getState();

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { temporaryPocket } = player;
  const token = tokens[temporaryPocket] ? tokens[temporaryPocket].name : '-';

  el.textContent = `Temporary: ${token}`;

  // Whenever we receive the changes to our pocket
  el.subscribe('player:pockets', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { temporaryPocket } = e.detail;
    const token = tokens[temporaryPocket] ? tokens[temporaryPocket].name : '-';

    el.textContent = `Temporary: ${token}`;
  });

  el.click(() => {
    const state = context.getState();

    // If nothing is in our pocket
    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the pocket
      state.tokenSelection = 'temporary-pocket';
    } else if (state.tokenSelection === 'temporary-pocket') {
      // Deselect
      state.tokenSelection = null;
    // If something is in our pocket
    } else {
      // Otherwise perform a swap
      const to = 'temporary-pocket';
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    // Update our client state with our selection
    context.setState({ tokenSelection: state.tokenSelection });
  });

  // Whenever someone plays the activate temporary pocket spell
  el.subscribe('player:temporary-pocket', (e) => {
    const { start, duration } = e.detail; 
    // The end time (ie. 'that many seconds far ahead')
    const end = start + duration;

    const interval = context.setInterval(() => {
      const { game, player } = context.getState();
      const { tokens } = game;
      const { temporaryPocket } = player;

      // First get our current token
      const token = tokens[temporaryPocket]
        ? tokens[temporaryPocket].name
        : '-';

      // We take a timestamp ('now' in seconds)
      const now = Date.now();
      // Calculate how many seconds are left
      const sec = ((end - now) / 1000).toFixed(1);
      el.textContent = `Temporary: ${token} (${sec}s)`;

      // If none are, stop our interval
      if (sec <= 0) {
        clearInterval(interval);
        el.textContent = `Temporary: ${token}`;
      }
    }, 100);
  });

  return el;
}

export default TemporaryPocket;
