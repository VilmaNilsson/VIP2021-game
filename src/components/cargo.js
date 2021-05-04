function Cargo(el, context) {
  const { game, player } = context.getState();
  const cargoSlot = el.getElementById("cargo-slot");

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { cargo } = player;
  const token = tokens[cargo.token] ? tokens[cargo.token].name : '-';

  cargoSlot.src = token;

  // Whenever we receive the changes to our cargo
  el.subscribe('player:cargos', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { cargo } = e.detail;
    const token = tokens[cargo.token] ? tokens[cargo.token].name : '-';

    cargoSlot.src = token;
  });

  el.click(() => {
    const state = context.getState();

    // If nothing is in our cargo
    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the cargo
      state.tokenSelection = 'cargo';
    // If something is in our cargo
    } else if (state.tokenSelection === 'cargo') {
      // Deselect
      state.tokenSelection = null;
    } else {
      // Otherwise perform a swap
      const to = 'cargo';
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    // Update our client state with our selection
    context.setState({ tokenSelection: state.tokenSelection });
  });

  return el;
}

export default Cargo;
