// All components should be a function that receives an element and then inserts
// whatever HTML is needed and then returns the element back
function Navigation(el) {
  el.innerHTML = `
    <a href="/">Page 1</a>
    <a href="/page-2">Page 2</a>
    <a href="/page-3">Page 3</a>
  `;

  el.querySelectorAll('a').forEach((a) => {
    // Set the active class
    if (a.getAttribute('href') === window.location.pathname) {
      a.classList.add('active');
    }

    a.addEventListener('click', (event) => {
      // Disable regular clicks
      event.preventDefault();
      // `navigate` is enabled from `router.js`, we'll call it with the href of
      // each anchor (<a>)
      const url = a.getAttribute('href');
      el.navigate(url);
    });
  });

  return el;
}

export default Navigation;
