import Router from '../router';

function MainView() {
  const el = document.createElement('div');
  el.id = 'main';

  el.innerHTML = `
    <img src="/assets/logo.svg" alt="Logotype">
    <h2>Are you the Gamemaster or a Player? Make your choice.</h2>
    <button id="create-btn" class="pregame-btn">Create Game</button>
    <button id="join-btn" class="pregame-btn">Join Game</button>
  `;

  el.click('#create-btn', () => el.navigate('/create'));
  el.click('#join-btn', () => el.navigate('/join'));

  return el;
}

export default {
  before: (context) => {
    // const { username } = context.getState();
    // console.log('here?', username);

    // if (!username) {
    //   return Router.redirect('/login');
    // }

    return true;

    // const uid = context.getCache('_uid');

    // // Check if a username is cached, if not -> login
    // if (!uid) {
    //   return Router.redirect('/login');
    // }

    // return true;
  },
  path: '/',
  view: MainView,
};
