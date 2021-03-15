// A lightweight implementation of the Publish/Subscribe (pub/sub) pattern
const PubSub = {
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
  // Publishes `event` with a `payload`,
  // `CustomEvent` is a way of creating our own "click"-like events
  publish: function publish(event, payload) {
    // If we have no listeners for the `event` we'll do nothing
    if (this.listeners[event] === undefined) {
      return;
    }

    // Otherwise we'll go through each listener (element) and dispatch it
    this.listeners[event].forEach((listener) => {
      // If the listener is a function we'll just invoke it
      if (typeof listener === 'function') {
        listener(payload);
      } else {
        // Otherwise we'll dispatch a CustomEvent
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
      if (typeof currentListener === 'function') {
        return currentListener.name !== listener.name;
      }

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
  connect: function connect(url) {
    this.socket = new WebSocket(url);
    // We invoke ".bind(this)" so these function can call the `PubSub` functions
    // via `this`
    this.socket.addEventListener('open', this.connectionOpened.bind(this));
    this.socket.addEventListener('close', this.connectionClosed.bind(this));
    this.socket.addEventListener('message', this.incomingMessage.bind(this));
  },
  // When the WebSocket connection is established
  connectionOpened: function connectionOpened() {
    console.info('%cWebSocket connection established', 'color: #35b51a;');
    // Connection established means we just opened the connection
    this.lastPing = Date.now();

    // Every 10 seconds we'll "ping" the server to keep the connection alive
    window.setInterval(() => {
      const now = Date.now();
      const elapsed = new Date(now - this.lastPing);

      // If more then 40 seconds has passed since our last activity
      if (elapsed.getSeconds() > 40) {
        // We'll "ping" our server
        this.send('ping', {});
      }
    }, 1000 * 10);
  },
  // When the WebSocket connection is closed
  connectionClosed: function connectionClosed() {
    // TODO: try reconnecting when the connection closes
    console.info('%cWebSocket connection closed', 'color: red;');
  },
  // When we receive a message from our WebSocket
  incomingMessage: function incomingMessage(e) {
    try {
      const { event, payload } = JSON.parse(e.data);

      // Grouped logging for readability
      console.group('WebSocket Message Received');
      console.log(`%c${event}`, 'color: #35b51a;');
      console.log(payload);
      console.groupEnd();

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

      // Grouped logging for readability
      console.group('Sending message');
      console.log(`%c${event}`, 'color: #35b51a;');
      console.log(payload);
      console.groupEnd();

      // Whenever we send a message we'll update the "ping" timestamp, so we
      // only "ping" the server when we haven't had any activity for a while
      this.lastPing = Date.now();
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
