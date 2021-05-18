function Cargo(el, context) {
  const { game, player } = context.getState();

  // We need both the game and the player for this component
  if (!game || !player) {
    return el;
  }

  const { tokens, teams } = game;
  const { cargo, team } = player;
  const token = tokens[cargo.token] ? tokens[cargo.token].name : '-';

  el.innerHTML = `
    <div class="token">
      <img src="/assets/${token}.png">
    </div>
  `;

  const img = el.querySelector('img');
  const teamColor = teams[team].color;

  el.style.backgroundColor = teamColor;

  // Get the team-number of the player's team and use it to set the
  // background color of the element to the team's color

  // Whenever we receive the changes to our cargo
  el.subscribe('player:cargos', (e) => {
    const { game } = context.getState();
    const { tokens } = game;
    const { cargo } = e.detail;

    const token = tokens[cargo.token]
      ? tokens[cargo.token].name
      : '-';

    img.src = `/assets/${token}.png`;
    el.classList.remove('selected');
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

    // Visuals for (de)selecting
    if (state.tokenSelection === null) {
      el.classList.remove('selected');
    } else {
      el.classList.add('selected');
    }

    // Update our client state with our selection
    context.setState({ tokenSelection: state.tokenSelection });
  });

  return el;
}

export default Cargo;
