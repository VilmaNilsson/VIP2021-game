import PlayTimer from './play-timer';

function Stations(el, context) {
  const { game, player } = context.getState();

  if (!game || !player) {
    return el;
  }

  el.innerHTML = `<div id="timer"></div>`;

  const timerEl = el.querySelector('#timer');

  PlayTimer(timerEl, context);

  // RENDER ALL STATIONS
  // ===================

  // This should most likely be broken into functions
  const stations = game.stations.map((station, i) => {
    const div = document.createElement('div');
    div.className = 'station';

    const src = station.name.toLowerCase().replace(/\s/g, '');

    div.innerHTML = `
      <img src="/assets/${src}.png">
      <div class="name">${station.name}</div>
    `;

    if (station.locked) {
      div.classList.add('locked');
    }

    // When a player selects a station for a action
    let selectable = false;

    // Simple on-off toggle, should probably just be classes
    function setSelectable(s) {
      selectable = s;

      if (s) {
        div.classList.add('selectable');
      } else {
        div.classList.remove('selectable');
      }
    }

    div.click(() => {
      const { action, game } = context.getState();

      // If our client state contains a action and our stations can be selected
      if (action && selectable) {
        // Deselect it (just for the looks)
        setSelectable(false);
        // Then send the station-action, since they clicked a station as their
        // target
        div.send('player:action', { ...action, station: i });
        // Deselect the action in our client state
        context.setState({ action: null });
      } else {
        // Don't allow login if the station is locked
        if (game.stations[i].locked) {
          return;
        }

        if (div.classList.contains('active')) {
          return;
        }

        // Otherwise they wanted to login
        div.send('station:login', { station: i });
      }
    });

    // div.subscribe('player:action:stations', () => setSelectable(true));

    // When the station is selectable for actions (all station-actions)
    div.subscribe('player:action:station', () => setSelectable(true));
    // Otherwise remove the selection
    div.subscribe('player:action:cooldown', () => setSelectable(false));
    div.subscribe('player:action:cancel', () => setSelectable(false));
    div.subscribe('player:action:fail', () => setSelectable(false));

    // Highlight the station you're in
    if (player.inStation && player.inStation.station === i) {
      div.classList.add('active');
    }

    // TODO: upon initial render, we need to check what active actions we have

    el.append(div);
    return div;
  });

  // ACTION LISTENERS
  // ================
  
  // When they log into another station lets clear the bg
  el.subscribe('station:login:done', (e) => {
    const payload = e.detail;
    player.inStation = payload;
    context.setState({ player });

    stations.forEach((s, i) => {
      if (payload.station === i) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  });

  // Only show the border on the planet you're logging into
  el.subscribe('station:login:wait', (e) => {
    const payload = e.detail;

    stations.forEach((s, i) => {
      if (payload.station === i) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  });

  // When the station gets locked
  el.subscribe('action:station:locked', (e) => {
    const { station } = e.detail;
    const { game } = context.getState();
    game.stations[station].locked = true;
    context.setState({ game });

    const stationEl = stations[station];
    stationEl.classList.add('locked');
  });

  // When the lock action fades
  el.subscribe('action:station:locked:faded', (e) => {
    const { station } = e.detail;
    const { game } = context.getState();
    game.stations[station].locked = false;
    context.setState({ game });

    const stationEl = stations[station];
    stationEl.classList.remove('locked');
  });

  // Station gets unlocked
  el.subscribe('action:station:unlocked', (e) => {
    const { station } = e.detail;
    const { game } = context.getState();
    game.stations[station].locked = false;
    context.setState({ game });

    const stationEl = stations[station];
    stationEl.classList.remove('locked');
  });

  // Double points for a Planet
  el.subscribe('action:station:x2', (e) => {
    const { station } = e.detail;
    console.log('x2' , station);
  });

  // Double points for a Planet
  el.subscribe('action:station:x2:faded', (e) => {
    const { station } = e.detail;

  });

  // Double points for all Planets
  el.subscribe('action:stations:x2', (e) => {
    // const payload = e.detail;
    console.log('x2 all');
  });

  // Double points for all Planets faded
  el.subscribe('action:stations:x2:faded', (e) => {
    // const payload = e.detail;
  });

  return el;
}

export default Stations;
