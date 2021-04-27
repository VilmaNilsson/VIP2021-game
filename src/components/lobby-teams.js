function LobbyTeams(el, context) {
  const { game, player } = context.getState();

  if (!game) {
    return el;
  }

  // This could possibly be broken into a function (to increase readability)
  game.teams.forEach((team, teamIndex) => {
    const div = document.createElement('div');

    div.innerHTML = `
      <p>${team.name}</p>
      <div class="players"></div>
    `;

    const playersEl = div.querySelector('.players');

    // Lets go through all players and see if they have joined a team
    Object.entries(game.players).forEach((entry) => {
      // `Object.entries` gives us each object as [key, value]
      const [id, player] = entry;

      // They've joined this team
      if (player.team === teamIndex) {
        const newPlayer = document.createElement('div');
        // We'll store the player ID on this div so we can filter out them when
        // they switch teams
        newPlayer.dataset.id = id;
        newPlayer.textContent = player.username;
        playersEl.append(newPlayer);
      }
    });

    // Join a team when you click on it
    div.click(() => {
      div.send('team:join', { team: teamIndex });
    });

    // Whenever someone joins a team
    div.subscribe('team:joined', (e) => {
      const { playerId, username, team } = e.detail;

      // If a player joined another team, check to see if they already were a part
      // of this team, in that case remove that player
      if (team !== teamIndex) {
        Array.from(playersEl.children).forEach((playerEl) => {
          if (playerEl.dataset.id === playerId) {
            playerEl.remove();
          }
        });
      } else {
        // Otherwise they joined this team
        const newPlayer = document.createElement('div');
        // We'll store the player ID on this div so we can filter out them when
        // they switch teams
        newPlayer.dataset.id = playerId;
        newPlayer.textContent = username;
        playersEl.append(newPlayer);
      }
    });

    el.append(div);
  });

  return el;
}

export default LobbyTeams;
