import { CreateGameForm, GamePasscode } from '../components';

function CreateView() {
  const el = document.createElement('div');
  el.id = 'create';

  el.innerHTML = `
    <h1>Game Chat</h1>
    <p>Create a new game</p>
    <div id="create-game-form"></div>
    <div id="game-passcode"></div>
  `;

  const formElem = el.querySelector('#create-game-form');
  const passcodeElem = el.querySelector('#game-passcode');

  CreateGameForm(formElem);

  el.subscribe('game:create', () => {
    // Remove the form when a game is created
    formElem.remove();
    // And show them the passcode
    GamePasscode(passcodeElem);
  });

  return el;
}

export default {
  path: '/create',
  view: CreateView,
};
