// A lightweight implementation of the Publish/Subscribe (pub/sub) pattern
const PubSub = {
  // Our WebSocket connection
  socket: null,
  // Object of events and their listeners, { 'player:connected': [...], ... }
  listeners: {},
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
  // Clears all subscribed listeners
  unsubscribeAll: function unsubscribeAll() {
    this.listeners = {};
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
    // TODO: start pinging the websocket server
    console.info('%cWebSocket connection established', 'color: #35b51a;');
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
      console.log(`%c${event}`, 'color: red;');
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
      const message = JSON.stringify({ event, payload });
      this.socket.send(message);
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

// NOTE: Only for testing purposes!
window.PubSub = PubSub;

export default PubSub;
