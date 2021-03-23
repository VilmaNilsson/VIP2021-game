function HomeView() {
  const el = document.createElement('div');
  el.id = 'home';

  el.innerHTML = `
    <h1>Home</h1>
  `;

  return el;
}

export default {
  path: '/',
  view: HomeView,
};
