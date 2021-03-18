function HomeView() {
  const el = document.createElement('div');
  el.id = 'home';

  el.innerHTML = `
    <h1>Game Chat</h1>
    <p>Where everybody knows your name</p>
    <button id="create-button">Create game</button>
    <button id="join-button">Join game</button>
  `;

  el.querySelector('#create-button').addEventListener('click', () => {
    el.navigate('/create');
  });

  el.querySelector('#join-button').addEventListener('click', () => {
    el.navigate('/join');
  });

  return el;
}

export default {
  path: '/home',
  view: HomeView,
};
