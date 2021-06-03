function LoginView() {
  const el = document.createElement('div');
  el.id = 'login-view';

  el.innerHTML = `
    <img src="/assets/logo.svg" alt="Logotype">
    <h2>Enter your player name</h2>
    <div class="pregame-errmsg" id="error"></div>
    <input class="pregame-input" type="text" placeholder="Your name..." maxLength="20">
    <button class="pregame-btn" id="login-button">Login</button>
  `;

  const errorEl = el.querySelector('#error');
  const inputEl = el.querySelector('input');

  inputEl.addEventListener('keyup', (e) => {
    if (e.key !== 'Enter' || e.target.value.length < 2) {
      return;
    }

    const username = inputEl.value;
    el.send('player:login', { username });
  });

  el.click('#login-button', () => {
    if (inputEl.value.length < 2) {
      errorEl.textContent = 'Player name is to short';
      return;
    } else if (inputEl.value.length > 10) {
      errorEl.innerText = 'Your name exceeds the maximum of 10 characters';
      return;
    }

    errorEl.textContent = '';
    const username = inputEl.value;
    el.send('player:login', { username });
  });

  el.subscribe('player:you', () => {
    el.navigate('/');
  });

  const errorMessages = ['That player name is already taken'];

  el.subscribe('player:login:fail', (e) => {
    const payload = e.detail;
    const message = errorMessages[payload.errorCode];
    errorEl.textContent = message;
  });

  return el;
}

export default {
  path: '/login',
  view: LoginView,
};
