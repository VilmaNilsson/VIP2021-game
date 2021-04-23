function MainView() {
  const el = document.createElement('div');

  el.innerHTML = `
    <h1>Main menu</h1>
    <button id="create">Create</button>
    <button id="join">Join</button>
  `;

  el.click('#create', () => el.navigate('/create'));
  el.click('#join', () => el.navigate('/join'));

  return el;
}

export default {
  path: '/',
  view: MainView,
};
