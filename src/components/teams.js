function Teams(el, context) {
  const { game, player } = context.getState();

  if (!game) {
    return el;
  }

  el.className = "rocket-team-container";
 
  game.teams.forEach((team, i) => {
    const div = document.createElement('div');
    div.className = "rocket rocket-team" + (i + 1);

    div.textContent = pad(`${team.score}`, 4);

    // The game-score event gives us the latest scores, no need to calculate
    // anything
    div.subscribe('game:score', (e) => {
    const { score } = e.detail;
    const newScore = score[i];
    div.textContent = pad(`${newScore}`, 4);
    });
   
	function pad(num, size) {
		num = num.toString();
		while (num.length < size) 
			num = '0' + num;
		return num;
	}

// When a player selects a station for a action
    let selectable = false;
    // Simple on-off toggle, should probably just be classes
    function setSelectable(s) {
      selectable = s;

      if (s) {
        div.classList.add('selectable');
        div.style.border = 'solid green';
      } else {
        div.classList.remove('selectable');
        div.style.border = 'none';
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
  });

  return el;
}

export default Teams;