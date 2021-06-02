// Renders a slot within a rack
function renderSlot(slot, tokenIndex, teamIndex, context) {
  const { player, game } = context.getState();
  const { team } = player;
  const { tokens } = game;

  // Slots should most likely be divs
  const el = document.createElement('div');
  el.className = `slot team-${teamIndex + 1}`;
  // Current token name (image path)
  const token = tokens[slot.token] ? tokens[slot.token].name : '-';
  
  // And the divs should be styled via classes
  el.innerHTML = `
    <div class="token">
      <img src="/assets/${token}.png">
    </div>
  `;

  // Not your own rack
  if (team !== teamIndex) {
    return el;
  }

  el.click(() => {
    const state = context.getState();

    // If our current token seletion is empty
    if (state.tokenSelection === null || state.tokenSelection === undefined) {
      // Select the pocket
      state.tokenSelection = tokenIndex;
    // When we have something selected and selects the same
    } else if (state.tokenSelection === tokenIndex) {
      // Deselect
      state.tokenSelection = null;
    } else {
      // Otherwise perform a swap
      const to = tokenIndex;
      const from = state.tokenSelection;
      el.send('token:swap', { to, from });
      state.tokenSelection = null;
    }

    if (state.tokenSelection === null) {
      el.classList.remove('selected');
    } else {
      el.classList.add('selected');
    }

    // Save our selection to state
    context.setState({ tokenSelection: state.tokenSelection });
  });

  return el;
}

// Render a rack (and updates it when we receive updates)
function renderRack(rack, teamIndex, context) {
  const div = document.createElement('div');
  div.className = `rack team-${teamIndex + 1}`;

  const { player } = context.getState();
  const { team } = player;

  if (team !== teamIndex) {
    div.classList.add('other-team');
  } else {
    div.classList.add('your-rack');
  }

  // Render the slots
  const slots = rack.slots.map((slot, tokenIndex) => {
    const el = renderSlot(slot, tokenIndex, teamIndex, context);
    div.append(el);
    return slot;
  });

  // Whenever we receive a rack update to a station
  div.subscribe('station:rack', (e) => {
    const { team, rack, scored } = e.detail;
    
    // If the update isnt for this team, dont do anything
    if (team !== teamIndex) {
      return;
    }

    div.innerHTML = '';

    if (scored) {
      div.classList.add('scored');
      context.setTimeout(() => div.classList.remove('scored'), 500);
    }

    rack.slots.forEach((slot, tokenIndex) => {
      const slotElem = renderSlot(slot, tokenIndex, teamIndex, context);
      div.append(slotElem);
    });
  });

  // When a player selects a station for a action
  let selectable = false;
  // Simple on-off toggle, should probably just be classes
  function setSelectable(s) {
    selectable = s;

    if (s) {
      div.classList.add('selectable');
    } else {
      div.classList.remove('selectable');
      div.classList.remove('not-selectable');
    }
  }

  // When other racks are selectable
  div.subscribe('player:action:racks', () => {
    // Don't make your own team selectable
    if (team !== teamIndex) {
      setSelectable(true)
    } else {
      div.classList.add('not-selectable');
    }
  });

  // When your rack is selectable
  div.subscribe('player:action:rack', () => {
    // Don't make other teams racks selectable
    if (team === teamIndex) {
      setSelectable(true)
    } else {
      div.classList.add('not-selectable');
    }
  });

  // Otherwise remove the selection
  div.subscribe('player:action:cooldown', () => setSelectable(false));
  div.subscribe('player:action:cancel', () => setSelectable(false));
  div.subscribe('player:action:fail', () => setSelectable(false));

  div.click(() => {
    const { action } = context.getState();

    // Unable to click on this rack
    if (div.classList.contains('not-selectable')) {
      return;
    }

    if (action && selectable) {
      setSelectable(false);
      div.send('player:action', { ...action, rack: teamIndex });
    }
  });

  return div;
}

function generateEmptyRacks(game) {
  return Array.from({ length: game.teams.length }).map((r) => {
    return {
      slots: Array.from({ length: 6 }).map((s) => {
        return { token: -1 };
      })
    };
  });
}

function Racks(el, context) {
  const { game, player, racks } = context.getState();

  if (!game || !player) {
    return el;
  }

  // Always reset this since it gets rerendered lots of times
  el.innerHTML = '';

  // Racks gets changed with every login, this is the first ones
  const initialRacks = racks && racks.length ? racks : generateEmptyRacks(game);

  console.log(initialRacks);

  // TODO: change into an image
  if (!racks || racks.length === 0) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay no-racks';
    overlay.textContent = 'Click on a planet in order to land on it';
    el.append(overlay);
  }

  // Render each rack
  const rackElements = initialRacks.map((rack, teamIndex) => {
    return renderRack(rack, teamIndex, context);
  });

  // Place your own rack at the bottom (ie. pop your own rack and place it at
  // the end of the array and then append all racks again)
  rackElements
    .concat(rackElements.splice(player.team, 1))
    .forEach((rack) => el.append(rack));

  // LOGIN LISTENERS
  // ===============

  // NOTE: this is currently already handled by our wait-listeners
  el.subscribe('station:login:done', (e) => {
  });
  
  // Login overlay (while waiting)
  el.subscribe('station:login:wait', (e) => {
    const { stations } = game;
    const { station, racks, start, duration } = e.detail;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    // Always reset this
    el.innerHTML = '';

    // Render all racks
    const rackElements = racks.map((rack, teamIndex) => {
      return renderRack(rack, teamIndex, context);
    });

    // Place your own rack at the bottom
    rackElements
      .concat(rackElements.splice(player.team, 1))
      .forEach((rack) => el.append(rack));

    // And then append our overlay
    el.append(overlay);

    const name = stations[station].name;

    // Landing
    context.setInterval({
      start,
      duration,
      onTick: (time) => {
        overlay.textContent = `
          Landing on ${name} in ${time.seconds + 1}s
        `;

        const alpha = (time.timestamp / duration).toFixed(2);
        overlay.style.backgroundColor = `rgba(255, 255, 255, ${alpha}`;
      },
      onEnd: () => {
        overlay.remove();
      },
    });
  });

  return el;
}

export default Racks;
