// Import all of our CSS
import './styles/index.css';
import routes from './views';
import PubSub from './pubsub';
import Router from './router';

// Set the root HTML element (which is where our views gets mounted)
Router.setRoot(document.getElementById('root'));
// Add all routes to our Router
Object.values(routes).forEach((route) => Router.on(route.path, route));
// Try to resolve the current location (ie. browser URL)
Router.resolve();
// Open a WebSocket connection
PubSub.connect('ws://localhost:7001');
