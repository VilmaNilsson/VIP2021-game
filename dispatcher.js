// All of our event handlers
const events = require('./events');
// Reduce the `events` object into something more managable
const eventHandlers = Object.values(events).reduce((acc, next) => {
  acc = { ...acc, ...next };
  return acc;
}, {});

// `events` is an object of { 'event:name': eventHandler, ... }
function dispatch(event, context, payload = {}) {
  if (eventHandlers[event] !== undefined) {
    try {
      const eventHandler = eventHandlers[event];
      // Dispatch our event (ie. call one of our event handlers)
      eventHandler(context, payload);
      // `%O` is a String Substitution (read up on MDN Docs for `console`)
      console.log(`[WS]: Dispatching "${event}" %O`, payload);
    } catch (err) {
      console.log('[WS]: Event error caught', err);
    }
  } else {
    console.log(`[WS]: Event not registered: ${event}`);
  }
}

module.exports = {
  dispatch,
};
