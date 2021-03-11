import Context from '../context';
import { Navigation } from '../components';

function Page3() {
  const el = document.createElement('div');
  el.id = 'page-3';

  el.innerHTML = `
    <h1>Into mordor the page 3 went</h1>
    <div id="navigation"></div>
    <p>Some random content</p>
  `;

  el.querySelector('p').addEventListener('click', () => {
    console.log(Context.getState());
  });

  Navigation(el.querySelector('#navigation'));

  return el;
}

export default {
  path: '/page-3',
  view: Page3,
};
