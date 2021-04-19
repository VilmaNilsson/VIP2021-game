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

// Searches an array of objects for an object that contains the keys and values
// from another object (`properties`)
function findObjectByProperties(objects, properties) {
  return objects.reduce((notFound, object) => {
    const isFound = Object.entries(properties).every((entry) => {
      const [key, value] = entry;
      return object[key] === value;
    });

    if (isFound) {
      return object;
    }

    return notFound;
  }, null);
}

// Courtesy of: https://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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
    console.log('[WS]: Sending', msg);
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

// Creates the base object for a Game
function createGame(state = {}) {
  const id = generateUUID();
  const game = {
    id,
    name: '',
    timeouts: [],
    tokens: [],
    stations: [],
    teams: [],
    players: {},
    ...state,
    defaults: {
      planPhaseDuration: 30,
      playPhaseDuration: 60 * 5,
      phase: { type: 0 },
      ...state.defaults,
    },
  };

  // Make properties a copy of defaults
  game.properties = { ...game.defaults };

  return game;
}

// Creates the base object for a Station
function createStation(state = {}) {
  const station = {
    name: '',
    racks: [],
    ...state,
    defaults: {
      locked: false,
      loginTime: 7,
      loginMultiplier: 1,
      salaryMultiplier: 1,
      ...state.defaults,
    },
  };

  station.properties = { ...station.defaults };

  return station;
}

// Generate a rack
function createRack(nrOfTokens) {
  return Array.from({ length: nrOfTokens }).map(() => {
    return {
      token: Math.floor(Math.random() * nrOfTokens),
    };
  });
}

// Create racks for a station based on the number of teams and tokens
function createRacks(nrOfTeams, nrOfTokens) {
  const randomRack = createRack(nrOfTokens);

  return Array.from({ length: nrOfTeams }).map(() => {
    return {
      // NOTE: If we dont make a copy (spread) it will use the same rack for all
      // teams within a station (ie. a reference)
      slots: [...randomRack],
    };
  });
}

// Create tokens.....for now it dosnt take any arguments
function createTokens() {
  // Our tokes (for now) is just a simple array of { name: letter }
  const tokens = 'ABCDEF'.split('').map((letter) => {
    return { name: letter };
  });
  return tokens;
}

// Creates the base object for a Team
function createTeam(state = {}) {
  const team = {
    name: '',
    crew: -1,
    ...state,
    defaults: {
      score: 0,
      locked: false,
      immune: false,
      silenced: false,
      loginMultiplier: 1,
      salaryMultiplier: 1,
      ...state.defaults,
    },
  };

  team.properties = { ...team.defaults };

  return team;
}

// Creates the base object for a Player
function createPlayer(state = {}) {
  const player = {
    team: -1,
    ...state,
    defaults: {
      locked: false,
      immune: false,
      silenced: false,
      loginMultiplier: 1,
      inStation: null,
      pocket: -1,
      pocketLocked: false,
      temporaryPocket: -1,
      temporaryPockedLocked: true,
      spells: [],
      ...state.defaults,
    },
  };

  player.properties = { ...player.defaults };

  return player;
}

// Returns a shuffled array of station names
function getStationNames() {
  return shuffle([
    'Uranus',
    'Blandito',
    'Margreth',
    'Urmom',
    'Pluto',
    'Moo',
    'Kim',
  ]);
}

// Filter out unecessary keys of a game
function filterGame(game) {
  return {
    id: game.id,
    name: game.name,
    tokens: game.tokens,
    stations: game.stations.map((station) => {
      const { name, properties } = station;
      return { name, properties };
    }),
    teams: game.teams.map((team) => {
      const { name, properties } = team;
      return { name, properties };
    }),
    players: Object.entries(game.players).reduce((players, entry) => {
      const [id, player] = entry;
      players[id] = { username: player.username, team: player.team };
      return players;
    }, {}),
  };
}

// Filter out unecessary keys of a player
function filterPlayer(player) {
  const { team, properties } = player;
  return { team, properties };
}

// Calculate the login time for a station
function getLoginTime(gameState, playerId, stationIndex) {
  // Unpack the needed properties from the gamestate
  const { stations, players } = gameState;

  // Get the specified objects
  const station = stations[stationIndex];
  const player = players[playerId];

  // Calculate the logintime based on the station's and the player's properties
  const loginTime = (
    (station.properties.loginTime * station.properties.loginMultiplier)
    * player.properties.loginMultiplier
  );

  // Return it
  return loginTime;
}

// Get all team scores as [team 1 score, team 2 score, ...]
function getTeamScores(game) {
  // Unpack the teams from the recieved gamestate
  const { teams } = game;
  return teams.map((team) => team.properties.score);
}

// Returns an array of player ids for a given station
function getPlayersInStation(game, stationIndex) {
  return Object.entries(game.players)
    .filter((entry) => {
      const [_, player] = entry;

      if (player.properties.inStation === null) {
        return false;
      }

      return player.properties.inStation.station === stationIndex;
    })
    .map((entry) => {
      const [id, _] = entry;
      return id;
    });
}

module.exports = {
  randomHex,
  generateUUID,
  withinTimeframe,
  findObjectByProperties,
  shuffle,
  send,
  sendTo,
  broadcast,
  broadcastTo,
  createGame,
  createStation,
  createRack,
  createRacks,
  createTokens,
  createTeam,
  createPlayer,
  filterGame,
  filterPlayer,
  getStationNames,
  getLoginTime,
  getTeamScores,
  getPlayersInStation,
};
