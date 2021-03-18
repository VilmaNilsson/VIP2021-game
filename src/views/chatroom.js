import Context from '../context';
import { ChatHistory, MessageBox } from '../components';

function ChatroomView() {
  const el = document.createElement('div');
  el.id = 'chatroom';

  const state = Context.getState();
  const game = state.game === undefined ? '' : state.game.name;

  el.innerHTML = `
    <h1>${game}</h1>
    <div id="chat-history"></div>
    <div id="message-box"></div>
  `;

  ChatHistory(el.querySelector('#chat-history'));
  MessageBox(el.querySelector('#message-box'));

  const h1 = el.querySelector('h1');
  h1.subscribe('game:info', (event) => {
    const payload = event.detail;
    h1.innerHTML = payload.name;
  });

  return el;
}

export default {
  path: '/chatroom',
  view: ChatroomView,
};
