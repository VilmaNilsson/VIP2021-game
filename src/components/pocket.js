function Pocket(el, context) {
  const { game, player } = context.getState();

  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { pocket } = player;
  const token = tokens[pocket] ? tokens[pocket].name : '-';
  el.textContent = `Pocket: ${token}`;

  el.subscribe('player:pockets', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { pocket } = e.detail;
    const token = tokens[pocket] ? tokens[pocket].name : '-';
    el.textContent = `Pocket: ${token}`;
  });

  el.click(() => {
    const state = context.getState();

    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the pocket
      state.tokenSelection = 'pocket';
    } else if (state.tokenSelection === 'pocket') {
      // Deselect
      state.tokenSelection = null;
    } else {
      // Select the second one, ie. a swap 
      const to = 'pocket';
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    context.setState({ tokenSelection: state.tokenSelection });
  });

  return el;
}

export default Pocket;
