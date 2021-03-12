import Context from '../context';
import { Navigation, Box } from '../components';

function Page2() {
  const el = document.createElement('div');
  el.id = 'page-2';

  el.innerHTML = `
    <h1>Cool page nr 2</h1>
    <div id="navigation"></div>
    <div id="box"></div>
  `;

  const h1 = el.querySelector('h1');

  h1.subscribe('player:echo', (e) => {
    const { message } = e.detail;
    h1.innerHTML = `Cool page nr 2 received ${message}`;

    Context.setState({ received: message });
  });

  // This creates our navigation component
  Navigation(el.querySelector('#navigation'));
  // This creates our example box
  Box(el.querySelector('#box'));

  return el;
}

export default {
  path: '/page-2',
  view: Page2,
};
