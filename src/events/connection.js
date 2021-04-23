function connectionOpen(context) {
  const id = context.getCache('_uid');
  const { player } = context.getState();

  // If we have no player state and a cached id exists, lets try to reconnect
  if (!player && id) {
    context.send('player:reconnect', { id });
  }
}

function connectionClose(context) {
  context.clearTimers();
}

export default {
  'connection:open': connectionOpen,
  'connection:close': connectionClose,
};
