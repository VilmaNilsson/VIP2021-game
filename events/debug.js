// Sends the whole server state to the client for debugging purposes
function getState(context) {
  const state = context.getState();
  context.send('debug:state', state);
}

// Clears the whole server state for debugging purposes
function clearState(context) {
  const state = context.clearState();
  context.send('debug:state', state);
}

// Echoes back whatever it receives
function echo(context, payload) {
  context.send('debug:echo', payload);
}

// This will be called when the client pings our server (to keep it alive)
function ping() {
}

module.exports = {
  'debug:state': getState,
  'debug:state:clear': clearState,
  'debug:echo': echo,
  ping,
};
