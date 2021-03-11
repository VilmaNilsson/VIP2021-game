// All of our event handlers
const events = require('./events');

// `events` is an object of { 'event:name': eventHandler, ... }
function dispatch(event, context, payload) {
  if (events[event] !== undefined) {
    try {
      // Dispatch our event (ie. call one of our event handlers)
      events[event](context, payload);
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
