function Stations(el, context) {
  const { game, player } = context.getState();

  if (!game || !player) {
    return el;
  }

  game.stations.forEach((station, i) => {
    const div = document.createElement('div');
    div.textContent = station.name;

    let selectable = false;

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
      const { spell } = context.getState();

      if (spell && selectable) {
        setSelectable(false);
        div.send('player:spell', { ...spell, station: i });
        context.setState({ spell: null });
      } else {
        div.send('station:login', { station: i });
      }
    });

    // When the station is selectable for spells
    div.subscribe('player:spell:stations', () => setSelectable(true));
    // 
    div.subscribe('player:spell:cooldown', () => setSelectable(false));
    div.subscribe('player:spell:cancel', () => setSelectable(false));
    div.subscribe('player:spell:fail', () => setSelectable(false));

    if (player.inStation && player.inStation.station === i) {
      div.style.background = '#ddd';
    }

    // When the station gets locked
    div.subscribe('spell:station:locked', (e) => {
      const payload = e.detail; 

      if (payload.station !== i) {
        return;
      }

      const { start, duration } = payload;
      const end = start + duration;

      const interval = context.setInterval(() => {
        const now = Date.now();
        const sec = ((end - now) / 1000).toFixed(1);
        div.textContent = `${station.name} (Locked ${sec}s)`;

        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = station.name;
        }
      }, 100);
    });

    let loginInterval = null;

    div.subscribe('station:login:wait', (e) => {
      const payload = e.detail;

      if (payload.station !== i) {
        if (loginInterval) {
          clearInterval(loginInterval);
          div.textContent = station.name;
        }

        return;
      }

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

      if (payload.station !== i) {
        div.style.background = 'white';
      }
    });

    el.append(div);
  });
}

export default Stations;
