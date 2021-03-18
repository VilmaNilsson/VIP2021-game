// Whenever a player logs in we'll save the username in the state and cache
function playerLogin(context, payload) {
  const { username } = payload;
  context.setState({ username });
  context.setCache('_player', username);
}

// Whenever we receive info about a player (when we reconnect) we'll store it
// inside our state
function playerInfo(context, payload) {
  context.setState(payload);
}

export default {
  'player:login': playerLogin,
  'player:info': playerInfo,
};
