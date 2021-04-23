function LoginView() {
  const el = document.createElement('div');
  el.id = 'home';

  el.innerHTML = `
    <h1>Home</h1>
    <div id="error"></div>
    <input type="text" id="login-field"><br>
    <button id="login-button">Login</button>
  `;

  const input = el.querySelector('#login-field');
  
  input.addEventListener('keyup', (e) => {
    if (e.key !== 'Enter' || e.target.value.length < 2) {
      return;
    }

    const username = input.value;
    el.send('player:login', { username });
  });

  el.click('#login-button', () => {
    if (input.value.length < 2) {
      return;
    }

    const username = input.value;
    el.send('player:login', { username });
  });

  el.subscribe('player:you', () => {
    el.navigate('/');
  });

  el.subscribe('player:login:fail', (e) => {
    el.querySelector('#error').textContent = 'Username already taken';
  });

  return el;
}

export default {
  path: '/login',
  view: LoginView,
};
