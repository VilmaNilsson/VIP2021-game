function Teams(el, context) {
  const { game, player } = context.getState();

  if (!game) {
    return el;
  }

  game.teams.forEach((team, i) => {
    const div = document.createElement('div');

    div.textContent = `${team.name} (${team.score})`;

    // The game-score event gives us the latest scores, no need to calculate
    // anything
    div.subscribe('game:score', (e) => {
      const { score } = e.detail;
      const newScore = score[i];
      div.textContent = `${team.name} (${newScore})`;
    });
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

    let interval;

    div.subscribe('action:teams:locked', (e) => {
      const payload = e.detail;

      // If the lock action wasn't for this station, do nothing
      if (payload.teamId !== i) {
        return;
      }
      const oldText = div.textContent;
      // The timer could be some component that we can reuse instead
      const { start, duration } = payload;
      // The end time (ie. 'that many seconds far ahead')
      const end = start + duration;

      interval = context.setInterval(() => {
        // We take a timestamp ('now' in seconds)
        const now = Date.now();
        // Calculate how many seconds are left
        const sec = ((end - now) / 1000).toFixed(1);
        div.textContent = `${team.name} (Locked ${sec}s)`;

        // If none are, stop our interval
        if (sec <= 0) {
          clearInterval(interval);
          div.textContent = oldText;
        }
      }, 100);
    });

    div.subscribe('action:teams:unlocked', () => {
      clearInterval(interval);
      div.textContent = `${team.name} (${team.score})`;
    });

    div.click(() => {
      const { action } = context.getState();
      if (action.event === 'action:teams:swap-rack' && action && selectable) {
        const station = player.inStation.station;
        div.send('player:action', { ...action, team: i, station });
      } else if (action && selectable) {
        setSelectable(false);
        div.send('player:action', { ...action, team: i });
      }
    });

    // When the station is selectable for actions (all station-actions)
    div.subscribe('player:action:teams', () => setSelectable(true));
    // Otherwise remove the selection
    div.subscribe('player:action:cooldown', () => setSelectable(false));
    div.subscribe('player:action:cancel', () => setSelectable(false));
    div.subscribe('player:action:fail', () => setSelectable(false));

    el.append(div);
  });

  return el;
}

export default Teams;
