function JoinGameForm(el) {
  el.innerHTML = `
    <p id="join-game-msg"></p>
    <input type="text" placeholder="Enter a passcode">
    <button>Join game</button>
  `;

  const msg = el.querySelector('#join-game-msg');
  const input = el.querySelector('input');
  const button = el.querySelector('button');

  // Whenever someone presses <Enter> we'll submit the code
  input.addEventListener('keydown', (event) => {
    const code = input.value;

    if (event.key === 'Enter' && code.length === 4) {
      el.send('game:join', { code });
    } else if (event.key === 'Enter') {
      msg.innerHTML = 'Please enter a passcode (4 characters)';
    }
  });

  // Or whenever they click the send button
  button.addEventListener('click', () => {
    const code = input.value;

    if (code.length === 4) {
      el.send('game:join', { code });
    } else {
      msg.innerHTML = 'Please enter a passcode (4 characters)';
    }
  });

  // If the join fails we'll update our <p> with the message
  msg.subscribe('game:join:fail', (event) => {
    const payload = event.detail;
    msg.innerHTML = payload.message;
  });

  return el;
}

export default JoinGameForm;
