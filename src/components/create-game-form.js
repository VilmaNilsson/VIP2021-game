function CreateGameForm(el) {
  el.innerHTML = `
    <p id="create-game-msg"></p>
    <input type="text" placeholder="Enter a game name">
    <button>Create game</button>
  `;

  const msg = el.querySelector('#create-game-msg');
  const input = el.querySelector('input');
  const button = el.querySelector('button');

  // Whenever the user presses <Enter> we'll submit the text
  input.addEventListener('keydown', (event) => {
    const name = input.value;

    if (event.key === 'Enter' && name.length > 1) {
      el.send('game:create', { name });
      input.value = '';
    } else if (event.key === 'Enter') {
      msg.innerHTML = 'Please enter a game name';
    }
  });

  // Or whenever they click the button
  button.addEventListener('click', () => {
    const name = input.value;

    if (name.length > 1) {
      el.send('game:create', { name });
      input.value = '';
    } else {
      msg.innerHTML = 'Please enter a game name';
    }
  });

  // If the creation of the game failed we'll update our <p> with the message
  msg.subscribe('game:create:fail', (event) => {
    const payload = event.detail;
    msg.innerHTML = payload.message;
  });

  return el;
}

export default CreateGameForm;
