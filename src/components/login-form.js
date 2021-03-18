function LoginForm(el) {
  el.innerHTML = `
    <p id="login-msg"></p>
    <input type="text" placeholder="Enter a username">
    <button>Login</button>
  `;

  const msg = el.querySelector('#login-msg');
  const input = el.querySelector('input');
  const button = el.querySelector('button');

  // Whenever they press <Enter> we'll submit the username
  input.addEventListener('keydown', (event) => {
    const username = input.value;

    if (event.key === 'Enter' && username.length > 1) {
      el.send('player:login', { username });
      input.value = '';
    } else if (event.key === 'Enter') {
      msg.innerHTML = 'Please enter a username';
    }
  });

  // Or whenever they press the send button
  button.addEventListener('click', () => {
    const username = input.value;

    if (username.length > 1) {
      el.send('player:login', { username });
      input.value = '';
    } else {
      msg.innerHTML = 'Please enter a username';
    }
  });

  // If the user failed to login we'll show them the error message
  msg.subscribe('player:login:fail', (event) => {
    const payload = event.detail;
    msg.innerHTML = payload.message;
  });

  return el;
}

export default LoginForm;
