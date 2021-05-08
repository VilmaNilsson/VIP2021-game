function Cargo(el, context) {
  const { game, player } = context.getState();
  const cargoObj = document.getElementById('cargo');
  const cargoSlot = document.getElementById('cargo-slot');

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  const { tokens } = game;
  const { cargo } = player;
  const token = tokens[cargo.token] ? tokens[cargo.token].name : '-';

  // Get the team-number of the player's team and use it to set the
  // background color of the element to the team's color
  const {team} = player;
  cargoObj.style.backgroundColor = `var(--team-color-${team})`;

  cargoSlot.src = `../../assets/${token}.png`;

  // Whenever we receive the changes to our cargo
  el.subscribe('player:cargos', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { cargo } = e.detail;
    const token = tokens[cargo.token] ? tokens[cargo.token].name : '-';

    cargoSlot.src = `../../assets/${token}.png`;
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
