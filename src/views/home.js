function HomeView() {
  const el = document.createElement('div');
  el.id = 'home';

  el.innerHTML = `
    <h1>Home</h1>
  `;
}

export default {
  path: '/',
  view: HomeView,
};
