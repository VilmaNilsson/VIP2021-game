const WebSocket = require('ws');

// Randomly generates a 4 letter hex code (eg. "4d8j", "ac9e", etc.)
function randomHex() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

// Generate a "Universal Unique IDentifier" (ie. ID for our websockets)
function generateUUID() {
  const p1 = randomHex();
  const p2 = randomHex();
  const p3 = randomHex();

  return `${p1}-${p2}-${p3}`;
}

// Compare two unix timestamps to see if the `received` is within `seconds`
function withinTimeframe(seconds, start, received) {
  const diff = received - start;
  const elapsed = Math.floor(diff / 1000);
  return elapsed <= seconds;
}

// Sends a `msg` to a websocket (if the connection is opened)
function send(ws, msg) {
  if (ws.readyState !== WebSocket.OPEN) {
    return;
  }

  // Incase the `msg` is already a string
  if (typeof msg === 'string') {
    ws.send(msg);
  } else {
    ws.send(JSON.stringify(msg));
  }
}

// Broadcasts a `msg` to all clients (with the possibility of excluding self)
function broadcast(wss, ws, msg, excludeSelf = false) {
  wss.clients.forEach((client) => {
    if (excludeSelf && client !== ws) {
      send(client, msg);
    } else {
      send(client, msg);
    }
  });
}

// Sends a `msg` to a client by `id`
function sendTo(wss, id, msg) {
  wss.clients.forEach((client) => {
    if (client._id === id) {
      send(client, msg);
    }
  });
}

// Broadcasts a `msg` to all clients in `ids`
function broadcastTo(wss, ids, msg) {
  wss.clients.forEach((client) => {
    if (ids.includes(client._id)) {
      send(client, msg);
    }
  });
}

module.exports = {
  randomHex,
  generateUUID,
  withinTimeframe,
  send,
  sendTo,
  broadcast,
  broadcastTo,
};
