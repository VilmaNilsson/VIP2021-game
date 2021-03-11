// A lightweight implementation of the Publish/Subscribe (pub/sub) pattern
const PubSub = {
  // Our WebSocket connection
  socket: null,
  // Object of events and their listeners, { 'player:connected': [...], ... }
  listeners: {},
  // Adds another element to the array of listeners for `event`
  subscribe: function subscribe(event, element) {
    // TODO: check that it doesnt exists
    if (this.listeners[event] === undefined) {
      this.listeners[event] = [element];
    } else {
      this.listeners[event] = [...this.listeners[event], element];
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
      const e = new CustomEvent(event, { detail: payload });
      listener.dispatchEvent(e);
    });
  },
  // Unsubscribe `element` from listening to `event`
  unsubscribe: function unsubscribe(event, element) {
    // If no one is listening we'll do nothing
    if (this.listeners[event] === undefined) {
      return;
    }

    // Otherwise we'll filter out the element form the array of listeners
    this.listeners[event] = this.listeners[event].filter((listener) => {
      return listener !== element;
    });
  },
  // Establish a WebSocket connection, and set the listeners
  connect: function connect(url) {
    this.socket = new WebSocket(url);
    // We invoke ".bind(this)" so these function can call the `PubSub` functions
    // via using `this`
    this.socket.addEventListener('open', this.connectionOpened.bind(this));
    this.socket.addEventListener('close', this.connectionClosed.bind(this));
    this.socket.addEventListener('message', this.incomingMessage.bind(this));
  },
  // When the WebSocket connection is established
  connectionOpened: function connectionOpened() {
    // TODO: start pinging the websocket server
    console.log('WebSocket connection established');
  },
  // When the WebSocket connection is closed
  connectionClosed: function connectionClosed() {
    // TODO: try reconnecting when the connection closes
    console.log('WebSocket connection closed');
  },
  // When we receive a message from our WebSocket
  incomingMessage: function incomingMessage(e) {
    try {
      const { event, payload } = JSON.parse(e.data);
      console.log(`Received: ${event}`, payload);
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
  // TODO: check that it doesnt exists
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
