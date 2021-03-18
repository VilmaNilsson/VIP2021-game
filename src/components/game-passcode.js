import Context from '../context';

function GamePasscode(el) {
  // NOTE: we should probably check that an game actually exists within our
  // state
  const { game } = Context.getState();

  el.innerHTML = `
    <p>Passcode: ${game.code}</p>
    <button>Enter the game</button>
  `;

  // Navigate the user to the chatroom
  el.querySelector('button').addEventListener('click', () => {
    el.navigate('/chatroom');
  });

  return el;
}

export default GamePasscode;
