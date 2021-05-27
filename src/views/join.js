import utils from '../utils';

function JoinView() {
  const el = document.createElement('div');
  el.id = 'join';

  el.innerHTML = `
    <img src="/assets/logo.svg" alt="Logotype">
    <h2>Join a game by entering the name</h2>
    <div id="join-error" class="pregame-errmsg"></div>
    <form>
      <input type="text" name="name" placeholder="Name of the game..." class="pregame-input">
      <button type="submit" class="pregame-btn">Join game</button>
    </form>
  `;

  const errorEl = el.querySelector('#join-error');
  const formEl = el.querySelector('form');

  const errorMessages = [
    'A game with that name does not exist',
    'That game has already started',
  ];

  errorEl.subscribe('game:joined:fail', (e) => {
    const payload = e.detail;
    const message = errorMessages[payload.errorCode];
    errorEl.textContent = message;
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = utils.serializeForm(e.target);
    el.send('game:join', payload);
  });

  el.subscribe('game:yours', () => {
    el.navigate('/lobby');
  });

  return el;
}

export default {
  path: '/join',
  view: JoinView,
};
