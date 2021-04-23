import utils from '../utils';

function CreateView() {
  const el = document.createElement('div');

  el.innerHTML = `
    <h1>Create</h1>

    <div id="error"></div>

    <form id="create-form">
      <label>
        Name
        <input type="text" name="name">
      </label>
      <br>

      <label>
        Nr of teams
        <input type="number" name="nrOfTeams" value="4">
      </label>
      <br>

      <label>
        Nr of stations
        <input type="number" name="nrOfStations" value="6">
      </label>
      <br>

      <label>
        Duration of plan phase (seconds)
        <input type="number" name="planDuration" value="60">
      </label>
      <br>

      <label>
        Duration of play phase (seconds)
        <input type="number" name="playDuration" value="300">
      </label>
      <br>

      <button type="submit">Create game</button>
    </form>
  `;

  el.querySelector('#error').subscribe('game:create:fail', (e) => {
    e.target.textContent = 'Game already exists';
  });
  
  el.querySelector('#create-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = utils.serializeForm(e.target);
    el.send('game:create', payload);
  });

  el.subscribe('game:yours', () => {
    el.navigate('/lobby');
  });

  return el;
}

export default {
  path: '/create',
  view: CreateView,
};
