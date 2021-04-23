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

  el.querySelector('#error').subscribe('game:join:fail', (e) => {
    e.target.textContent = 'Game doesnt exist';
  });

  el.querySelector('#join-form').addEventListener('submit', (e) => {
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

