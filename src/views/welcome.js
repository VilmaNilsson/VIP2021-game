function WelcomeView() {
  const el = document.createElement('div');
  el.id = 'welcome';

  el.innerHTML = `
    <h1>Game Chatroom</h1>
    <p>Where everybody knows your name</p>
    <button>Login</button>
  `;

  el.querySelector('button').addEventListener('click', () => {
    el.navigate('/login');
  });

  return el;
}

export default {
  path: '/',
  view: WelcomeView,
};
