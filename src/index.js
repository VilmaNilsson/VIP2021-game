// Import all of our CSS
import './styles/index.css';
import './styles/game-actions.css';
import './styles/login.css';
import views from './views';
import events from './events';
import PubSub from './pubsub';
import Router from './router';
import Context from './context';

// Set the root HTML element (which is where our views gets mounted)
Router.setRoot(document.getElementById('root'));
// Add all routes to our Router
Object.values(views).forEach((view) => Router.on(view.path, view));
// Try to resolve the current location (ie. browser URL)
Router.resolve();
// Make all of our event handlers subscribe to their events
Object.values(events).forEach((eventGroup) => {
  Object.entries(eventGroup).forEach((entry) => {
    const [eventName, eventHandler] = entry;
    PubSub.subscribe(eventName, eventHandler);
  });
});
// Open a WebSocket connection
PubSub.connect('ws://localhost:7001');

// NOTE: for debugging purposes we'll make our objects globally available
window.DEBUG = { PubSub, Router, Context };
