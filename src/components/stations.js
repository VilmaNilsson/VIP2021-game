function Stations(el, context) {
  const { game, player } = context.getState();

  if (!game || !player) {
    return el;
  }

  // This should most likely be broken into functions
  game.stations.forEach((station, i) => {
    const div = document.createElement('div');
    div.textContent = station.name;

    // When a player selects a station for a action
    let selectable = false;

    // Simple on-off toggle, should probably just be classes
    function setSelectable(s) {
      selectable = s;

      if (s) {
        div.classList.add('selectable');
        div.style.color = 'green';
      } else {
        div.classList.remove('selectable');
        div.style.color = 'black';
      }
    }

    div.click(() => {
      const { action } = context.getState();
      console.log(action);

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
      div.style.background = '#ddd';
    }

    // When the station gets locked
    div.subscribe('action:station:locked', (e) => {
      const payload = e.detail;

      // If the lock action wasn't for this station, do nothing
      if (payload.station !== i) {
        return;
      }

      // The timer could be some component that we can reuse instead
      const { start, duration } = payload;
      // The end time (ie. 'that many seconds far ahead')
      const end = start + duration;

      const interval = context.setInterval(() => {
        // We take a timestamp ('now' in seconds)
        const now = Date.now();
        // Calculate how many seconds are left
        const sec = ((end - now) / 1000).toFixed(1);
        div.textContent = `${station.name} (Locked ${sec}s)`;

        // If none are, stop our interval
        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = station.name;
        }
      }, 100);
    });

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

    // We need to store our login interval outside because they can click on
    // another station _while_ logging into another, this makes it resettable
    let loginInterval = null;

    // TODO: we should check from the start if a station is being logged in to
    // and then display a timer as well

    div.subscribe('station:login:wait', (e) => {
      const payload = e.detail;

      // If the login-wait event isnt for this station
      if (payload.station !== i) {
        // But we had an interval going, lets clear it
        if (loginInterval) {
          clearInterval(loginInterval);
          div.textContent = station.name;
        }

        return;
      }

      // Here we go again with the timer-component-to-be
      const { start, duration } = payload;
      const end = start + duration;

      clearInterval(loginInterval);

      loginInterval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);
        div.textContent = `${station.name} (Logging in ${sec}s)`;

        if (sec <= 0) {
          clearInterval(loginInterval);
          div.textContent = station.name;
          div.style.background = '#ddd';
        }
      }, 100);
    });

    // When they log into another station lets clear the bg
    div.subscribe('station:login:done', (e) => {
      const payload = e.detail;
      player.inStation = payload;
      context.setState({ player });
      if (payload.station !== i) {
        div.style.background = 'white';
      }
    });

    el.append(div);
  });
}

export default Stations;
