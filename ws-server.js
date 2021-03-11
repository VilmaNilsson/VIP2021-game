const WebSocket = require('ws');
const Dispatcher = require('./dispatcher');
const Context = require('./context');
const utils = require('./utils');

// Set a default port unless invoked with `$ WS_PORT=XXXX node ws-server.js`
const port = process.env.WS_PORT || 7001;
const wss = new WebSocket.Server({ port });

// When a websocket opens a connection
wss.on('connection', (ws) => {
  ws._id = utils.generateUUID();
  // Add the connection to our global state (of players)
  // TODO: Might want to add a timestamp for the connection
  Context.addPlayer(ws._id);

  // Create the state context object, which is the way our event handlers
  // operate on our global state
  const context = Context.create(wss, ws);

  // Manually emit the `player:connected` event
  Dispatcher.dispatch('player:connect', context);
  console.log(`[WS]: Player connected (${ws._id})`);

  // When a websocket receives a message
  ws.on('message', (message) => {
    try {
      // TODO: Might want to add a timestamp (Date.now()) for all messages
      const { event, payload } = JSON.parse(message);
      Dispatcher.dispatch(event, context, payload);
    } catch (err) {
      console.log('[WS]: Unable to parse JSON');
    }
  });

  // When the websocket closes the connection
  ws.on('close', () => {
    // Manually emit the `player:disconnected` event
    Dispatcher.dispatch('player:disconnect', context);
    console.log(`[WS]: Player disconnected (${ws._id})`);
  });
});

// When the websocket server starts listening for connections
wss.on('listening', () => {
  console.log(`[WS]: Started listening on port :${port}`);
});
