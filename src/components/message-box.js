function MessageBox(el) {
  el.innerHTML = `
    <input type="text">
  `;

  const input = el.querySelector('input');

  // Whenever they press <Enter> we'll submit the message
  input.addEventListener('keydown', (event) => {
    const message = input.value;

    if (event.key === 'Enter' && message.trim().length > 0) {
      el.send('chat:message', { message });
      input.value = '';
    }
  });

  return el;
}

export default MessageBox;
