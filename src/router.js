import PubSub from './pubsub';

// Our Router that checks the browser URL and then inserts to correct HTML node
// into the `root` element. We can also call `.navigate` to manually go from one
// URL to another.
const Router = {
  // Our root HTML node
  root: null,
  // Object of our routes (eg. { '/game': {}, '/lobby': {}, ... })
  routes: {},
  // Add another route
  on: function on(path, handler) {
    this.routes[path] = handler;
  },
  // Navigate to a new URL
  navigate: function navigate(path, replace = false) {
    if (this.routes[path] === undefined) {
      console.log(`Route [${path}] does not exist`);
      return;
    }

    // Changes the browser URL,
    // `replaceState` also resets the back/forward history
    if (replace) {
      window.history.replaceState({ path }, '', path);
      this.resolve(path);
    } else {
      window.history.pushState({ path }, '', path);
      this.resolve(path);
    }
  },
  // Resolve a path (URL), invokes the view of the route and the before and
  // after handlers
  resolve: function resolve(path = null) {
    // If invoked with no `path` we'll grab it from the browser URL
    if (path === null) {
      path = window.location.pathname;
    }

    // If no path exists within our routes we'll do nothing
    if (this.routes[path] === undefined) {
      console.log(`Route [${path}] does not exist`);
      return false;
    }

    // Before entering a new route we'll clear the existing listeners
    PubSub.unsubscribeAll();

    // Extract our route handler;
    // this should always contain a `view` (function that returns a element)
    // and might contain `before` and `after` functions
    const handler = this.routes[path];

    // Check if the `before` handler exists
    if (handler.before !== undefined) {
      const redirectPath = handler.before();

      // If it returns a string (via `Router.redirect`) we'll navigate to it
      if (typeof redirectPath === 'string') {
        // We'll also reset the back/forward history if they were redirected
        return this.navigate(redirectPath, true);
      }
    }

    // Check to see that our route actually has a `view`
    if (handler.view === undefined) {
      throw new Error(`No view was assigned to the path: ${path}`);
    }

    // Mount it into our HTML
    this.mount(handler.view);

    // Check if the `after` handler exists
    if (handler.after !== undefined) {
      handler.after();
    }

    // Everything went OK
    return true;
  },
  // Redirect (this might be modified in the future
  redirect: function redirect(path) {
    return path;
  },
  // Mount a view into our HTML (ie. the root node)
  mount: function mount(view) {
    try {
      // `view` would be one of the functions within "views/"
      const el = view();
      this.root.textContent = '';
      this.root.appendChild(el);
    } catch (err) {
      console.warn(`Unable to mount the view [${view.name}]`, err.message);
    }
  },
  // Set our root node
  setRoot: function setRoot(el) {
    this.root = el;
  },
};

// Listen to `popstate` (when a user presses back/forward in the browser)
window.addEventListener('popstate', (event) => {
  if (event.state !== null && event.state.path !== undefined) {
    Router.resolve(event.state.path);
  } else {
    Router.resolve('/');
  }
});

// Make our HTML elements be able to invoke Router.navigate more easily
HTMLElement.prototype.navigate = function navigate(path) {
  Router.navigate(path);
};

export default Router;
