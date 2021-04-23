function LobbyTeam(el, name, index) {
  el.innerHTML = `
    <p>${name}</p>
    <ul></ul>
  `;

  const ul = el.querySelector('ul');

  // Join a team when you click on it
  el.click(() => {
    el.send('team:join', { team: index });
  });

  el.subscribe('team:joined', (e) => {
    const { playerId, username, team } = e.detail;

    // If a player joined another team, check to see if they already were a part
    // of this team, in that case remove that player
    if (team !== index) {
      Array.from(ul.children).forEach((li) => {
        if (li.dataset.id === playerId) {
          li.remove();
        }
      });
    } else {
      // Otherwise they joined this team
      const li = document.createElement('li');
      li.dataset.id = playerId;
      li.textContent = username;
      ul.append(li);
    }
  });

  return el;
}

export default LobbyTeam;
