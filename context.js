const utils = require('./utils');

// The global state
const STATE = { players: {}, games: {} };

// Returns the state of a player by `id`
function getPlayerState(id) {
  if (STATE.players[id] === undefined) {
    return null;
  }

  return STATE.players[id];
}

// Updates the state of a player by `id`
function updatePlayerState(id, nextPlayerState) {
  if (STATE.players[id] === undefined) {
    return STATE.players[id];
  }

  const currentPlayerState = STATE.players[id];

  STATE.players[id] = {
    ...currentPlayerState,
    ...nextPlayerState,
  };

  return STATE.players[id];
}

// Returns the state of a game by `id`
function getGameState(id) {
  if (STATE.games[id] === undefined) {
    return null;
  }

  return STATE.games[id];
}

// Updates the state of a game by `id`
function updateGameState(id, nextGameState) {
  if (STATE.games[id] === undefined) {
    return null;
  }

  const currentGameState = STATE.games[id];

  STATE.games[id] = {
    ...currentGameState,
    ...nextGameState,
  };

  return STATE.games[id];
}

// Adds another player to the global state
function addPlayer(id, state = {}) {
  if (STATE.players[id] !== undefined) {
    return false;
  }

  STATE.players[id] = { id, ...state };
  return true;
}

// Removes a player from the global state
function removePlayer(id) {
  if (STATE.players[id] === undefined) {
    return false;
  }

  delete STATE.players[id];
  return true;
}

// Adds another game to the global state
function addGame(id, state = {}) {
  if (STATE.games[id] !== undefined) {
    return false;
  }

  STATE.games[id] = { id, ...state };
  return true;
}

// Removes a game from the global state
function removeGame(id) {
  if (STATE.games[id] === undefined) {
    return false;
  }

  delete STATE.games[id];
  return true;
}

// Creates a context based on the connected websocket id
function create(wss, ws) {
  // The connected websocket id (see `ws-server.js`)
  const websocketID = ws._id;

  return {
    id: websocketID,
    // Send a message to the connected client
    send: (event, payload) => {
      utils.send(ws, { event, payload });
    },
    // Send a message to a client by `id`
    sendTo: (id, event, payload) => {
      utils.sendTo(wss, id, { event, payload });
    },
    // Broadcast a message to all clients
    broadcast: (event, payload, self) => {
      utils.broadcast(wss, ws, { event, payload }, self);
    },
    // Broadcast a message to all clients with `ids`
    broadcastTo: (ids, event, payload) => {
      utils.broadcastTo(wss, ids, { event, payload });
    },
    // TODO: Broadcast a message to all players within a game
    broadcastToGame: (msg) => {
      // TBD
    },
    // Gets the player connected to the websocket,
    // or any player if invoked with a `playedId`
    getPlayerState: (playerId = null) => {
      if (playerId === null) {
        return getPlayerState(websocketID);
      }

      return getPlayerState(playerId);
    },
    // Updates the player connected to the websocket,
    // or any player if `nextPlayerState` contains `id`
    updatePlayerState: (nextPlayerState) => {
      if (nextPlayerState.id === undefined) {
        return updatePlayerState(websocketID, nextPlayerState);
      }

      return updatePlayerState(nextPlayerState.id, nextPlayerState);
    },
    // Gets the game state (based on the connected websocket),
    // or any game state if invoked with a `gameId`
    getGameState: (gameId = null) => {
      if (gameId === null) {
        const player = getPlayerState(websocketID);

        if (player !== null) {
          return getGameState(player.gameId);
        }
      }

      return getGameState(gameId);
    },
    // Updates the game state (based on the connected websocket),
    // or any game state if `nextGameState` contains `id`
    updateGameState: (nextGameState) => {
      if (nextGameState.id === undefined) {
        const player = getPlayerState(websocketID);

        if (player !== null) {
          return updateGameState(player.gameId, nextGameState);
        }
      }

      return updateGameState(nextGameState.id, nextGameState);
    },
  };
}

module.exports = {
  create,
  addPlayer,
  removePlayer,
  addGame,
  removeGame,
};
