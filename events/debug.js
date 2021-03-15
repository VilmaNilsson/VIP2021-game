// Sends the whole server state to the client for debugging purposes
function debugState(context) {
  context.send('debug:state', context.getState());
}

// This will be called when the client pings our server (to keep it alive)
function ping() {
  console.log('[WS]: Ping received');
}

module.exports = {
  'debug:state': debugState,
  ping,
};
