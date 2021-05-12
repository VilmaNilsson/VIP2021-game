import Router from '../router';

function MainView() {
  const el = document.createElement('div');
  el.id = 'mainWrapper';

  el.innerHTML = `
    <img id="login-logo" src="/assets/logo.svg" alt="LOGO">
    <h2>Are you the game master or a player?</h2>
    <button id="create">Create Game</button>
    <button id="join">Join Game</button>
  `;

  el.click('#create', () => el.navigate('/create'));
  el.click('#join', () => el.navigate('/join'));

  return el;
}

export default {
  before: (context) => {
    const uid = context.getCache('_uid');

    // Check if a username is cached, if not -> login
    if (!uid) {
      return Router.redirect('/login');
    }

    return true;
  },
  path: '/',
  view: MainView,
};
