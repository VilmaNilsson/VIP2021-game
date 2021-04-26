function LobbyTeam(el, name, index) {
  el.innerHTML = `
    <p>${name}</p>
    <div id="players"></div>
  `;

  const playersEl = el.querySelector('#players');

  // Join a team when you click on it
  el.click(() => {
    el.send('team:join', { team: index });
  });

  el.subscribe('team:joined', (e) => {
    const { playerId, username, team } = e.detail;

    // If a player joined another team, check to see if they already were a part
    // of this team, in that case remove that player
    if (team !== index) {
      Array.from(playersEl.children).forEach((playerEl) => {
        if (playerEl.dataset.id === playerId) {
          playerEl.remove();
        }
      });
    } else {
      // Otherwise they joined this team
      const div = document.createElement('div');
      div.dataset.id = playerId;
      div.textContent = username;
      playersEl.append(div);
    }
  });

  return el;
}

export default LobbyTeam;
