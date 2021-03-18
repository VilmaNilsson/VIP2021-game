// When a game is created we'll store it inside our state
function gameCreate(context, payload) {
  context.setState({ game: payload });
}

// Same goes when we receive 'game:info' (which is received when we reconnect)
function gameInfo(context, payload) {
  context.setState({ game: payload });
}

export default {
  'game:create': gameCreate,
  'game:info': gameInfo,
};
