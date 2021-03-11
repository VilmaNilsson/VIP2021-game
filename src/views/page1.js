import { Navigation } from '../components';

// All page views should be a function that creates and returns an element
function Page1() {
  const el = document.createElement('div');
  el.id = 'page-1';

  el.innerHTML = `
    <h1>This is Page 1</h1>
    <div id="navigation"></div>
    <p>Home page</p>
  `;

  // Components (parts of a page) should be called with an element
  Navigation(el.querySelector('#navigation'));

  return el;
}

const path = '/';

const before = () => {
  console.log('Before handler of Page1');
};

const after = () => {
  console.log('After handler of Page1');
};

export default {
  path,
  before,
  after,
  view: Page1,
};
