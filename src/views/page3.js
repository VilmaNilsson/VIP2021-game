import Router from '../router';
// NOTE: we only want to import `Navigation` (hence the destructuring)
import { Navigation } from '../components';

function Page3() {
  const el = document.createElement('div');
  el.id = 'page-3';

  el.innerHTML = `
    <h1>Into mordor the page 3 went</h1>
    <div id="navigation"></div>
    <p>Some random content</p>
  `;

  Navigation(el.querySelector('#navigation'));

  return el;
}

const path = '/page-3';

const before = () => {
  console.log('Before handler of Page3');
  // We can redirect the user away from this route, in this case we'll just
  // check for a global variable `testar`
  if (window.testar === 1) {
    console.log('Redirecting!');
    // If the `before` handler returns this, it will redirect the user
    return Router.redirect('/');
  }
};

export default {
  path,
  before,
  view: Page3,
};
