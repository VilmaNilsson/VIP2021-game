function Box(el) {
  el.innerHTML = `
    <p id="text"></p>
    <input type="text" id="message">
    <button id="send">Send a websocket message</button>
  `;

  const input = el.querySelector('#message');
  const send = el.querySelector('#send');
  const text = el.querySelector('#text');

  send.addEventListener('click', () => {
    const message = input.value;
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
