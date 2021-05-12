function Teams(el, context) {
  const { game, player } = context.getState();

  if (!game) {
    return el;
  }
  
  const grille = document.createElement('div');
  grille.className = "grille";

  game.teams.forEach((team, i) => {
    const div = document.createElement('div');
    //const dtext = document.createElement('div'); 	

    //dtext.textContent = ` ${team.score}`;
	
	//dtext.className = "text-rocket";
	div.textContent = ` ${team.score}`;
	
	if(i==0)
		div.className = "rocket-team1";
	if(i==1)
		div.className = "rocket-team2";
	if(i==2)
		div.className = "rocket-team3";
	if(i==3)
		div.className = "rocket-team4";

    // The game-score event gives us the latest scores, no need to calculate
    // anything
    div.subscribe('game:score', (e) => {
      const { score } = e.detail;
      const newScore = score[i];
	  
	  //dtext.textContent = `${newScore}`;
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
	
	//div.appendChild(dtext);
	grille.appendChild(div)
	
   
	
  });
  
  el.append(grille);
  return el;
}

export default Teams;
