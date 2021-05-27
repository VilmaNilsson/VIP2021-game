const WebSocket = require('ws');
const Dispatcher = require('./dispatcher');
const Context = require('./context');
const utils = require('./utils');

// Set a default port unless invoked with `$ WS_PORT=XXXX node ws-server.js`
const port = process.env.WS_PORT || 7001;
const wss = new WebSocket.Server({ port });

// When a websocket opens a connection
wss.on('connection', (ws) => {
  // Time of connection
  const connectedAt = Date.now();
  // Generate a unique ID for all of our websocket connetions
  ws._id = utils.generateUUID();
  // Add the connection to our global state (of players)
  Context.addPlayer(ws._id, { connectedAt });

  // Create the state context object, which is the way our event handlers
  // operate on our global state
  const context = Context.create(wss, ws);

  // Manually emit the `player:connected` event
  Dispatcher.dispatch('player:connect', context, { connectedAt });
  console.log(`[WS]: Player connected (${ws._id})`);

  // When a websocket receives a message
  ws.on('message', (message) => {
    try {
      // Timestamp for when the message was received
      const receivedAt = Date.now();
      // Extract the event name and the payload
      const { event, payload } = JSON.parse(message);
      // Dispatch the event to our event handlers
      Dispatcher.dispatch(event, context, { receivedAt, ...payload });
    } catch (err) {
      console.log('[WS]: Unable to parse JSON');
    }
  });

  // When the websocket closes the connection
  ws.on('close', () => {
    // Time of disconnect
    const disconnectedAt = Date.now();
    // Manually emit the `player:disconnected` event
    Dispatcher.dispatch('player:disconnect', context, { disconnectedAt });
    console.log(`[WS]: Player disconnected (${ws._id})`);
  });
});

// When the websocket server starts listening for connections
wss.on('listening', () => {
  console.log(`[WS]: Started listening on port :${port}`);
});
