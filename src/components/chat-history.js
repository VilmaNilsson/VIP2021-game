import Context from '../context';

// Creates the HTML for a chat message
function createMessage(message) {
  const div = document.createElement('div');

  const time = (new Date(message.time)).toTimeString().substring(0, 8);

  div.innerHTML = `
    <div class="time">${time}</div>
    <div class="player">${message.player}:</div>
    <div class="text">${message.text}</div>
  `;

  return div;
}

function ChatHistory(el) {
  const state = Context.getState();

  // If no game exists in the state, do nothing
  if (state.game !== undefined) {
    // Go through the history of chat messages
    state.game.history.forEach((message) => {
      const msg = createMessage(message);
      el.appendChild(msg);
    });
  }

  // Whenever a message is received we'll add it to our HTML
  el.subscribe('chat:message', (event) => {
    const payload = event.detail;
    const msg = createMessage(payload);
    el.appendChild(msg);
  });

  // Whenever we receive the hole game (ie. the chat history)
  el.subscribe('game:info', (event) => {
    const payload = event.detail;
    // We'll loop through the history and all the messages
    payload.history.forEach((message) => {
      const msg = createMessage(message);
      el.appendChild(msg);
    });
  });

  // Whenever someone joins we'll let print a message
  el.subscribe('game:join', (event) => {
    const payload = event.detail;

    const message = {
      time: Date.now(),
      player: '[SERVER]',
      text: `${payload.username} joined the chatroom.`,
    };

    const msg = createMessage(message);
    el.appendChild(msg);
  });

  return el;
}

export default ChatHistory;
