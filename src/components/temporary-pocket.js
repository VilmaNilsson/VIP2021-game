function TemporaryPocket(el, context) {
  const { game, player } = context.getState();

  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { temporaryPocket } = player;
  const token = tokens[temporaryPocket] ? tokens[temporaryPocket].name : '-';
  el.textContent = `Temporary: ${token}`;

  el.subscribe('player:pockets', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { temporaryPocket } = e.detail;
    const token = tokens[temporaryPocket] ? tokens[temporaryPocket].name : '-';
    el.textContent = `Temporary: ${token}`;
  });

  el.click(() => {
    const state = context.getState();

    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the pocket
      state.tokenSelection = 'temporary-pocket';
    } else if (state.tokenSelection === 'temporary-pocket') {
      // Deselect
      state.tokenSelection = null;
    } else {
      // Select the second one, ie. a swap 
      const to = 'temporary-pocket';
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    context.setState({ tokenSelection: state.tokenSelection });
  });

  el.subscribe('player:temporary-pocket', (e) => {
    const { start, duration } = e.detail; 
    const end = start + duration;

    const interval = context.setInterval(() => {
      const { game, player } = context.getState();
      const { tokens } = game;
      const { temporaryPocket } = player;

      const token = tokens[temporaryPocket]
        ? tokens[temporaryPocket].name
        : '-';

      const now = Date.now();
      const sec = ((end - now) / 1000).toFixed(1);
      el.textContent = `Temporary: ${token} (${sec}s)`;

      if (sec <= 0) {
        clearInterval(interval);
        el.textContent = `Temporary: ${token}`;
      }
    }, 100);
  });

  return el;
}

export default TemporaryPocket;
