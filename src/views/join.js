import utils from '../utils';

function JoinView() {
  const el = document.createElement('div');
  el.id = 'joinWrapper';

  el.innerHTML = `
    <h1>LOBBY</h1>
    <h2>Join game</h2>

    <div id="joinError"></div>

    <form id="join-form">
      <label>
        <input id="nameInput" type="text" name="name" placeholder="name">
      </label>

      <button id="joinBtn" type="submit">Join game</button>
    </form>
  `;

  const errorEl = el.querySelector('#joinError');
  const formEl = el.querySelector('#join-form');

  errorEl.subscribe('game:joined:fail', () => {
    errorEl.textContent = 'Game doesnt exist';
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
