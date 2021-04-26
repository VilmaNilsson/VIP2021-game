import utils from '../utils';

function JoinView() {
  const el = document.createElement('div');

  el.innerHTML = `
    <h1>Join</h1>

    <div id="error"></div>

    <form id="join-form">
      <label>
        Name
        <input type="text" name="name">
      </label>

      <button type="submit">Join game</button>
    </form>
  `;

  const errorEl = el.querySelector('#error');
  const formEl = el.querySelector('#join-form');

  errorEl.subscribe('game:join:fail', (e) => {
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

