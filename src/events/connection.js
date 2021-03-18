// When the websocket connection opens we'll check the cache if we've stored a
// username, if we have we'll send the 'player:reconnect' event
function connectionOpen(context) {
  const cachedPlayer = context.getCache('_player');

  if (cachedPlayer !== null) {
    context.send('player:reconnect', { username: cachedPlayer });
  }
}

export default {
  'connection:open': connectionOpen,
};
