// Render a rack (and update it when we receive updates)
function renderRack(rack, teamIndex, context) {
  const div = document.createElement('div');

  rack.slots.forEach((slot, tokenIndex) => {
    const slotElem = renderSlot(slot, tokenIndex, teamIndex, context);
    div.append(slotElem);
  });

  div.subscribe('station:rack', (e) => {
    const { team, rack } = e.detail;

    if (team !== teamIndex) {
      return;
    }

    div.innerHTML = '';

    rack.slots.forEach((slot, tokenIndex) => {
      const slotElem = renderSlot(slot, tokenIndex, teamIndex, context);
      div.append(slotElem);
    });
  });

  return div;
}

function renderSlot(slot, tokenIndex, teamIndex, context) {
  const { player, game } = context.getState();
  const { team } = player;
  const { tokens } = game;

  const el = document.createElement('span');
  const token = tokens[slot.token] ? tokens[slot.token].name : '-';

  // Not your own rack
  if (team !== teamIndex) {
    el.textContent = `${token} `;
    return el;
  }

  el.innerHTML = `<strong>${token} </strong>`;

  el.click(() => {
    const state = context.getState();

    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the pocket
      state.tokenSelection = tokenIndex;
    } else if (state.tokenSelection === tokenIndex) {
      // Deselect
      state.tokenSelection = null;
    } else {
      // Select the second one, ie. a swap 
      const to = tokenIndex;
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    context.setState({ tokenSelection: state.tokenSelection });
  });

  return el;
}

function Racks(el, context) {
  const { game, player, racks } = context.getState();

  if (!game || !player) {
    return el;
  }

  // Always reset this
  el.innerHTML = '';

  const initialRacks = racks ? racks : [];

  const rackElements = initialRacks.map((rack, teamIndex) => {
    return renderRack(rack, teamIndex, context);
  });

  // Place your own rack at the bottom
  rackElements
    .concat(rackElements.splice(player.team, 1))
    .forEach((rack) => el.append(rack));

  // Reset everything once a player has logged into a station
  el.subscribe('station:login:done', (e) => {
    const { racks } = e.detail;
    
    // Always reset this
    el.innerHTML = '';

    const rackElements = racks.map((rack, teamIndex) => {
      return renderRack(rack, teamIndex, context);
    });

    console.log('got racks?');

    // Place your own rack at the bottom
    rackElements
      .concat(rackElements.splice(player.team, 1))
      .forEach((rack) => el.append(rack));
  });
}

export default Racks;
