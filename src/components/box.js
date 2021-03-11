function Box(el) {
  el.innerHTML = `
    <p id="text"></p>
    <input type="text" id="message">
    <button id="send">Send a websocket message</button>
  `;

  const input = el.querySelector('#message');
  const button = el.querySelector('#send');
  const text = el.querySelector('#text');

  button.addEventListener('click', () => {
    const message = input.value;
    // The `.send` functions sends our message to the WebSocket server
    el.send('player:echo', { message });
    input.value = '';
  });

  text.subscribe('player:echo', (e) => {
    // All elements that receive data from `subscribe` has the payload stored
    // within `e.detail`
    const { message } = e.detail;
    text.innerHTML = `Received ${message}`;
  });

  return el;
}

export default Box;
