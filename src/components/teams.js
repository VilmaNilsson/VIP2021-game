import utils from '../utils';

function Teams(el, context) {
  const { game, player } = context.getState();

  if (!game) {
    return el;
  }

  const teams = game.teams.map((team, i) => {
    const div = document.createElement('div');
    div.className = 'team';
    div.style.backgroundImage = `url('/assets/rocket_${i}.svg')`;

    div.innerHTML = `
      <div class="score">${team.score}</div>
    `;

    const scoreEl = div.querySelector('.score');

    // The game-score event gives us the latest scores, no need to calculate
    // anything
    // div.subscribe('game:score', (e) => {
    //   const { score } = e.detail;
    //   const newScore = score[i];
    //   scoreEl.textContent = newScore;
    // });

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

    let interval;

    // TODO: finish
    div.subscribe('action:teams:locked', (e) => {
      const payload = e.detail;

      // If the lock action wasn't for this station, do nothing
      if (payload.teamId !== i) {
        return;
      }

      // const oldText = div.textContent;
      // The timer could be some component that we can reuse instead
      const { start, duration } = payload;
      // The end time (ie. 'that many seconds far ahead')
      //
      div.classList.add('locked');

      context.setInterval({
        start,
        duration,
        onTick: (time) => {

        },
        onEnd: () => {
          div.classList.remove('locked');
        },
      });

    });

    // TODO: remove icon
    div.subscribe('action:teams:unlocked', (e) => {
      const payload = e.detail;

      // If the lock action wasn't for this station, do nothing
      if (payload.teamId !== i) {
        return;
      }

      div.classList.remove('locked');
      // clearInterval(interval);
      // div.textContent = `${team.name} (${team.score})`;
    });

    // TODO: this should be a rack instead?
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

    return div;
  });

  el.subscribe('game:score', (e) => {
    const { score } = e.detail;
    
    teams.forEach((teamEl, i) => {
      const newScore = score[i];
      const scoreEl = teamEl.querySelector('.score');
      scoreEl.textContent = newScore;
    });
  });

  return el;
}

export default Teams;
