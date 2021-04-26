function Pocket(el, context) {
  const { game, player } = context.getState();

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { pocket } = player;
  const token = tokens[pocket] ? tokens[pocket].name : '-';

  el.textContent = `Pocket: ${token}`;

  // Whenever we receive the changes to our pocket
  el.subscribe('player:pockets', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { pocket } = e.detail;
    const token = tokens[pocket] ? tokens[pocket].name : '-';

    el.textContent = `Pocket: ${token}`;
  });

  el.click(() => {
    const state = context.getState();

    // If nothing is in our pocket
    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the pocket
      state.tokenSelection = 'pocket';
    // If something is in our pocket
    } else if (state.tokenSelection === 'pocket') {
      // Deselect
      state.tokenSelection = null;
    } else {
      // Otherwise perform a swap
      const to = 'pocket';
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    // Update our client state with our selection
    context.setState({ tokenSelection: state.tokenSelection });
  });

  return el;
}

export default Pocket;
