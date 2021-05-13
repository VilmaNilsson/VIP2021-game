function Teams(el, context) {

  const { game, player } = context.getState();

 

  if (!game) {

    return el;

  }

 

  const team_grid = document.createElement('div');

  team_grid.className = "rocket-team-master-div";

 

  game.teams.forEach((team, i) => {

    const div = document.createElement('div');

            div.className = "rocket-team";

 

    div.textContent = `${team.score}`;

 

    // The game-score event gives us the latest scores, no need to calculate

    // anything

    div.subscribe('game:score', (e) => {

      const { score } = e.detail;

      const newScore = score[i];

      div.textContent = `${newScore}`;

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

    team_grid.appendChild(div);

  });

 

  el.append(team_grid);

  return el;

}

 

export default Teams;