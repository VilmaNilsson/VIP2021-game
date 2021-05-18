// Renders a slot within a rack
function renderSlot(slot, tokenIndex, teamIndex, context) {
  const { player, game } = context.getState();
  const { team } = player;
  const { tokens } = game;

  const teamColor = game.teams[teamIndex].color;

  // Slots should most likely be divs
  const el = document.createElement('div');
  el.className = 'slot';
  el.style.backgroundColor = teamColor;

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

// Render a rack (and update it when we receive updates)
function renderRack(rack, teamIndex, context) {
  const div = document.createElement('div');
  div.className = 'rack';

  const { player } = context.getState();
  const { team } = player;

  if (team !== teamIndex) {
    div.classList.add('other-team');
  } else {
    div.classList.add('your-rack');
  }

  // Render the slots
  rack.slots.forEach((slot, tokenIndex) => {
    const slotElem = renderSlot(slot, tokenIndex, teamIndex, context);
    div.append(slotElem);
  });

  // Whenever we receive a rack update to a station
  div.subscribe('station:rack', (e) => {
    const { team, rack } = e.detail;

    // If the update isnt for this team, dont do anything
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

function Racks(el, context) {
  const { game, player, racks } = context.getState();

  if (!game || !player) {
    return el;
  }

  // Always reset this since it gets rerendered lots of times
  el.innerHTML = '';

  // Racks gets changed with every login, this is the first ones
  const initialRacks = racks ? racks : [];

  if (initialRacks.length === 0) {
    el.innerHTML = `
      <div class="overlay no-racks">
        Click on a planet in order to land on it
      </div> 
    `;
  }

  // NOTE: maybe we should render something when there are no racks?

  // Render each rack
  const rackElements = initialRacks.map((rack, teamIndex) => {
    return renderRack(rack, teamIndex, context);
  });

  // Place your own rack at the bottom (ie. pop your own rack and place it at
  // the end of the array and then append all racks again)
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

    // Place your own rack at the bottom
    rackElements
      .concat(rackElements.splice(player.team, 1))
      .forEach((rack) => el.append(rack));
  });

  const { stations } = game;
  
  el.subscribe('station:login:wait', (e) => {
    const payload = e.detail;
    const name = stations[payload.station].name;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    el.append(overlay);

    const { start, duration } = payload;

    context.setInterval({
      start,
      duration,
      onTick: (time) => {
        overlay.textContent = `
          Landing on ${name} in ${time.seconds + 1}s
        `;
      },
      onEnd: () => {
        overlay.remove();
      },
    });

    // If the login-wait event isnt for this station
    // if (payload.station !== i) {
    //   // But we had an interval going, lets clear it
    //   if (loginInterval) {
    //     clearInterval(loginInterval);
    //     div.textContent = station.name;
    //   }

    //   return;
    // }

    // // Here we go again with the timer-component-to-be
    // const { start, duration } = payload;
    // const end = start + duration;

    // clearInterval(loginInterval);

    // loginInterval = context.setInterval(() => {
    //   const now = Date.now();
    //   const sec = ((end - now) / 1000).toFixed(1);
    //   div.textContent = `${station.name} (Logging in ${sec}s)`;

    //   if (sec <= 0) {
    //     clearInterval(loginInterval);
    //     div.textContent = station.name;
    //     div.style.background = '#ddd';
    //   }
    // }, 100);
  });

  return el;
}

export default Racks;
