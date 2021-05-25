import PlayTimer from './play-timer';

function Stations(el, context) {
  const { game, player } = context.getState();

  let lockInterval;

  if (!game || !player) {
    return el;
  }

  el.innerHTML = `
    <div id="timer"></div>
  `;

  const timerEl = el.querySelector('#timer');

  const { teams } = game;
  const { team } = player;
  const teamColor = teams[team].color;

  PlayTimer(timerEl, context);

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

      // The station is locked, dont do anything
      if (game.stations[i].locked) {
        return false;
      }

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
        // Otherwise they wanted to login
        div.send('station:login', { station: i });
      }
    });

    // When the station is selectable for actions (all station-actions)
    div.subscribe('player:action:stations', () => setSelectable(true));
    // Otherwise remove the selection
    div.subscribe('player:action:cooldown', () => setSelectable(false));
    div.subscribe('player:action:cancel', () => setSelectable(false));
    div.subscribe('player:action:fail', () => setSelectable(false));

    // Highlight the station you're in
    if (player.inStation && player.inStation.station === i) {
      div.classList.add('active');
    }
    //
    // We need to store our login interval outside because they can click on
    // another station _while_ logging into another, this makes it resettable
    // let loginInterval = null;

    // ACTIONS ==========


    // div.subscribe('action:station:unlocked', () => {
    //   clearInterval(lockInterval);
    //   div.textContent = station.name;
    // });

    div.subscribe('action:station:double-points', (e) => {
      const payload = e.detail;

      if (payload.station !== i) {
        return;
      }

      const { start, duration } = payload;

      const end = start + duration;

      const interval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);

        div.textContent = `${station.name} (Double ${sec}s)`;

        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = station.name;
        }
      }, 100);
    });

    div.subscribe('action:station:half-points', (e) => {
      const payload = e.detail;

      if (payload.station !== i) {
        return;
      }

      const { start, duration } = payload;

      const end = start + duration;

      const interval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);

        div.textContent = `${station.name} (Half ${sec}s)`;

        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = station.name;
        }
      }, 100);
    });

    div.subscribe('action:stations:double-points', (e) => {
      const payload = e.detail;

      const { start, duration } = payload;

      const end = start + duration;

      const interval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);

        div.textContent = `${station.name} (Double ${sec}s)`;

        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = station.name;
        }
      }, 100);
    });

    div.subscribe('action:stations:half-points', (e) => {
      const payload = e.detail;

      const { start, duration } = payload;

      const end = start + duration;

      const interval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);

        div.textContent = `${station.name} (Half ${sec}s)`;

        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = station.name;
        }
      }, 100);
    });

    el.append(div);
    return div;
  });
  
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
    const payload = e.detail;

    // If the lock action wasn't for this station, do nothing
    // if (payload.station !== i) {
    //   return;
    // }
    //
    const { game } = context.getState();
    game.stations[payload.station].locked = true;
    context.setState({ game });

    const stationEl = stations[payload.station];

    stationEl.classList.add('locked');

    // The timer could be some component that we can reuse instead
    const { start, duration } = payload;

    context.setInterval({
      start,
      duration,
      onTick: (time) => {},
      onEnd: () => {
        stationEl.classList.remove('locked');
      },
    });
  });

  el.subscribe('action:station:locked:faded', (e) => {
    const payload = e.detail;
    const { game } = context.getState();
    game.stations[payload.station].locked = false;
    context.setState({ game });
    stations[payload.station].classList.remove('locked');
  });
  
  el.subscribe('action:station:unlocked', (e) => {
    const payload = e.detail;
    const { game } = context.getState();
    game.stations[payload.station].locked = false;
    context.setState({ game });
    stations[payload.station].classList.remove('locked');
  });

  return el;
}

export default Stations;
