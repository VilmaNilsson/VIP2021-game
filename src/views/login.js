import { LoginForm } from '../components';

function LoginView() {
  const el = document.createElement('div');
  el.id = 'login';

  el.innerHTML = `
    <h1>Login</h1>
    <div id="login-form"></div>
  `;

  // The login form
  LoginForm(el.querySelector('#login-form'));

  // When the user successfully logs in we'll navigate them to /home
  el.subscribe('player:login', () => {
    el.navigate('/home');
  });

  return el;
}

export default {
  path: '/login',
  view: LoginView,
};
