import Router from '../router';

// Try to reconnect if we have stored a UserId in localStorage
function connectionOpen(context) {
  const id = context.getCache('_uid');
  const { player } = context.getState();

  // If we have no player state and a cached id exists, lets try to reconnect
  if (!player && id) {
    context.send('player:reconnect', { id });
  } else {
    // Otherwise we'll reroute them to the login page
    Router.navigate('/login');
  }
}

// Clear all active timers whenever the connection closes
function connectionClose(context) {
  context.clearTimers();
}

export default {
  'connection:open': connectionOpen,
  'connection:close': connectionClose,
};
