// A lightweight implementation of the Publish/Subscribe (pub/sub) pattern
const PubSub = {
  url: null,
  // Our WebSocket connection
  socket: null,
  // Object of events and their listeners, { 'player:connected': [...], ... }
  listeners: {},
  // Last time we pinged the WebSocket server (to keep it alive)
  lastPing: null,
  // Adds another element/callback to the array of listeners for `event`
  subscribe: function subscribe(event, listener) {
    if (this.listeners[event] === undefined) {
      this.listeners[event] = [listener];
    } else {
      this.listeners[event] = [...this.listeners[event], listener];
    }
  },
  // Publishes `event` with a `payload`
  publish: function publish(event, payload) {
    // Grouped logging for readability
    console.groupCollapsed(`Event dispatched: %c${event}`, 'color: #177503;');
    console.log(payload);
    console.groupEnd();

    // If we have no listeners for the `event` we'll do nothing
    if (this.listeners[event] === undefined) {
      console.info(`Event [${event}] has no listeners`);
      return;
    }

    // Otherwise we'll go through each listener (element) and dispatch it
    this.listeners[event].forEach((listener) => {
      // If the listener is a function we'll just invoke it
      if (typeof listener === 'function') {
        listener(payload);
      } else {
        // Otherwise we'll dispatch a CustomEvent, `CustomEvent` is a way of
        // creating our own "click"-like events
        const e = new CustomEvent(event, { detail: payload });
        listener.dispatchEvent(e);
      }
    });
  },
  // Unsubscribe `listener` from listening to `event`
  unsubscribe: function unsubscribe(event, listener) {
    // If no one is listening we'll do nothing
    if (this.listeners[event] === undefined) {
      return;
    }

    // Otherwise we'll filter out the listener from the array of listeners
    this.listeners[event] = this.listeners[event].filter((currentListener) => {
      // If they're unsubscribing a listener which is a function, we'll compare
      // the function names
      if (typeof currentListener === 'function') {
        return currentListener.name !== listener.name;
      }

      // HTML elements can be compared normally
      return currentListener !== listener;
    });
  },
  // Clears all subscribed element listeners, `force` clears everything
  unsubscribeAll: function unsubscribeAll(force = false) {
    if (force) {
      this.listeners = {};
    } else {
      // Go through all of our registered events and their listeners
      Object.keys(this.listeners).forEach((event) => {
        this.listeners[event] = this.listeners[event].filter((listener) => {
          // Keep the listener if it's a function (ie. not an HTML element)
          return typeof listener === 'function';
        });
      });
    }
  },
  // Establish a WebSocket connection, and set the listeners
  connect: function connect(url = null) {
    if (url !== null) {
      // Save the URL
      this.url = url;
    }

    // Try to connect to our websocket server
    this.socket = new WebSocket(this.url);
    // We invoke ".bind(this)" so these function can call the `PubSub` functions
    // via `this`
    this.socket.addEventListener('open', this.connectionOpened.bind(this));
    this.socket.addEventListener('close', this.connectionClosed.bind(this));
    this.socket.addEventListener('message', this.incomingMessage.bind(this));
  },
  // When the WebSocket connection is established
  connectionOpened: function connectionOpened() {
    // Dispatch an event for established connection
    this.publish('connection:open', {});
    console.log('%cWebSocket connection established', 'color: #177503;');
    // We'll store the timestamp of the our connection (for pinging)
    this.lastPing = Date.now();

    // Every 10 seconds we'll "ping" the server to keep the connection alive
    window.setInterval(this.ping.bind(this), 1000 * 10);
  },
  // When the WebSocket connection is closed
  connectionClosed: function connectionClosed() {
    // Dispatch an event for closed connection
    this.publish('connection:close', {});
    console.log('%cWebSocket connection closed', 'color: red;');

    // Try to reconnect 5 seconds after the connection closed
    window.setTimeout(this.connect.bind(this), 1000 * 5);
  },
  // When we receive a message from our WebSocket
  incomingMessage: function incomingMessage(e) {
    try {
      const { event, payload } = JSON.parse(e.data);
      // Publish the received event and payload
      this.publish(event, payload);
    } catch (err) {
      console.warn('Unable to parse JSON', e.data);
    }
  },
  // Sends a message to our WebSocket
  send: function send(event, payload) {
    if (this.socket !== null && this.socket.readyState === WebSocket.OPEN) {
      // Send our message to the server as { event, payload }
      const message = JSON.stringify({ event, payload });
      this.socket.send(message);
      // Log all messages being sent to the websocket server
      console.groupCollapsed(`Sending message: %c${event}`, 'color: #177503;');
      console.log(payload);
      console.groupEnd();
      // Whenever we send a message we'll update the "ping" timestamp, so we
      // only "ping" the server when we haven't had any activity for a while
      this.lastPing = Date.now();
    }
  },
  // If no activity has happened for 40 seconds we'll "ping" the server
  ping: function ping() {
    const now = Date.now();
    const elapsed = new Date(now - this.lastPing);

    // If more then 40 seconds has passed since our last activity
    if (elapsed.getSeconds() > 40) {
      // We'll "ping" our server
      this.send('ping', {});
    }
  },
};

// Make our HTML elements be able to subscribe to events
HTMLElement.prototype.subscribe = function subscribe(event, callback) {
  PubSub.subscribe(event, this);
  this.addEventListener(event, callback);
};

// Make our HTML elements be able to unsubscribe from events
HTMLElement.prototype.unsubscribe = function unsubscribe(event) {
  PubSub.unsubscribe(event, this);
};

// Make our HTML elements be able to publish events
HTMLElement.prototype.publish = function publish(event, payload) {
  PubSub.publish(event, payload);
};

// Make our HTML elements be able to send data to our WebSocket
HTMLElement.prototype.send = function send(event, payload) {
  PubSub.send(event, payload);
};

export default PubSub;
