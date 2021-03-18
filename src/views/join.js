import { JoinGameForm } from '../components';

function JoinView() {
  const el = document.createElement('div');
  el.id = 'join';

  el.innerHTML = `
    <h1>Game Chat</h1>
    <p>Join a game</p>
    <div id="join-game-form"></div>
  `;

  JoinGameForm(el.querySelector('#join-game-form'));

  el.subscribe('game:info', () => {
    el.navigate('/chatroom');
  });

  return el;
}

export default {
  path: '/join',
  view: JoinView,
};
