// We'll place all calculating functions here (salary for a team, login time for
// a station, etc.).

function getTickDuration(game) {
  // In milliseconds
  const playDuration = game.properties.playPhaseDuration * 1000;
  // Duration between salaries (ie. ticks)
  const tickDuration = playDuration / game.properties.nrOfSalaries;
  return tickDuration;
}

function getTeamSalaries(game) {
  const { teams, stations, tokens } = game;

  // Contain the total of each token that each team have in a station
  const STATIONS_PER_TEAM = [];
  // Contain all stations and the highest amount of tokens that a team have
  // also contain what team is having the lead, or if more teams have the same amount
  const STATIONS_COUNTER = [];
  // Contain the amount of points each team will get in total of all the stations
  const SCORE_COUNTER = {};

  // Add amount of teams to our array and object
  for (let i = 0; i < teams.length; i += 1) {
    STATIONS_PER_TEAM[i] = [];
    SCORE_COUNTER[i] = 0;
  }

  // Adding amount of stations to the arrays
  for (let i = 0; i < STATIONS_PER_TEAM.length; i += 1) {
    for (let j = 0; j < stations.length; j += 1) {
      STATIONS_PER_TEAM[i][j] = [];
      STATIONS_COUNTER[j] = [];
      for (let token = 0; token < tokens.length; token += 1) {
        // Default value of the team tokens, and the station counters object
        STATIONS_PER_TEAM[i][j][token] = 0;
        // Amount == amount of that token && team == amount of teams with that amount of tokens
        STATIONS_COUNTER[j][token] = { amount: 0, team: [] };
      }
    }
  }

  //  Calculating the amount of tokens each team have in their stations
  for (let i = 0; i < stations.length; i += 1) {
    for (let j = 0; j < stations[i].racks.length; j += 1) {
      stations[i].racks[j].slots.forEach((token) => {
        if (token.token >= 0) {
          STATIONS_PER_TEAM[j][i][token.token] += 1;
        }
      });
    }
  }

  // Super-looping
  // Checking if any team have the same amount of tokens on a station
  // Checking if a team have more amount of tokens than another team
  for (let i = 0; i < STATIONS_PER_TEAM.length; i += 1) {
    for (let j = 0; j < stations.length; j += 1) {
      for (let k = 0; k < STATIONS_PER_TEAM[i][j].length; k += 1) {
        // Check if a teams amount of tokens is more or equal to what the station counter have
        if (STATIONS_PER_TEAM[i][j][k] >= STATIONS_COUNTER[j][k].amount) {
          // If it is the same amount, we push that team into the team array
          if (STATIONS_PER_TEAM[i][j][k] === STATIONS_COUNTER[j][k].amount) {
            STATIONS_COUNTER[j][k].team.push(i);
          } else {
            // If its not the same it will be more then we add that amount of tokens to the counter
            STATIONS_COUNTER[j][k].amount = STATIONS_PER_TEAM[i][j][k];
            // We empty the team array and add the team
            // Since the team have more and will be the only team with that amount
            STATIONS_COUNTER[j][k].team = [];
            STATIONS_COUNTER[j][k].team.push(i);
          }
        }
      }
    }
  }

  // Calculate the amount of points each team will recieve from that specific station
  for (let i = 0; i < stations.length; i += 1) {
    for (let token = 0; token < tokens.length; token += 1) {
      // Checking if theres more than one team in the team array
      // If there is more none will get a point from that token
      if (STATIONS_COUNTER[i][token].team.length === 1) {
        const { team } = STATIONS_COUNTER[i][token];
        // Will get the amount of multiplication from the station
        const STATION_MULTIPLIER = stations[i].properties.salaryMultiplier;
        // Will get the amount of multiplication from the team
        const TEAM_MULTIPLIER = teams[team].properties.salaryMultiplier;

        // The defualt score for having the most tokens is 1
        let score = 1;
        // Since spells can affect stations or teams we have to multiply twice
        // Multiplying with the stations multiplier
        score *= STATION_MULTIPLIER;
        // Multiplying with the team multiplier
        score *= TEAM_MULTIPLIER;

        // Add amount of score that the teams will get in total to our score counter
        SCORE_COUNTER[team] += score;
      }
    }
  }

  return SCORE_COUNTER;
}

function getSalaryByStation(game, station) {
  const { teams, stations, tokens } = game;

  const THE_STATION = stations[station];

  // Contain the total of each token that each team have in a station
  const TEAM_STATION = [];
  // Contain all stations and the highest amount of tokens that a team have
  // also contain what team is having the lead, or if more teams have the same amount
  const STATION_COUNTER = {};
  // Contain the amount of points each team will get in total of all the stations
  const SCORE_COUNTER = {};

  for (let i = 0; i < teams.length; i += 1) {
    TEAM_STATION[i] = [];
    SCORE_COUNTER[i] = 0;
  }

  for (let i = 0; i < teams.length; i += 1) {
    TEAM_STATION[i] = [];
    for (let token = 0; token < tokens.length; token += 1) {
      // Default value of the team tokens, and the station counters object
      TEAM_STATION[i][token] = 0;
      // Amount == amount of that token && team == amount of teams with that amount of tokens
      STATION_COUNTER[token] = { amount: 0, team: [] };
    }
  }

  for (let i = 0; i < THE_STATION.racks.length; i += 1) {
    THE_STATION.racks[i].slots.forEach((slot) => {
      if (slot.token >= 0) {
        // console.log(slot.token)
        TEAM_STATION[i][slot.token] += 1;
      }
    });
  }

  // Checking if any team have the same amount of tokens on a station
  // Checking if a team have more amount of tokens than another team
  for (let i = 0; i < TEAM_STATION.length; i += 1) {
    for (let k = 0; k < TEAM_STATION[i].length; k += 1) {
      // Check if a teams amount of tokens is more or equal to what the station counter have
      if (TEAM_STATION[i][k] >= STATION_COUNTER[k].amount) {
        // If it is the same amount, we push that team into the team array
        if (TEAM_STATION[i][k] === STATION_COUNTER[k].amount) {
          STATION_COUNTER[k].team.push(i);
        } else {
          // If its not the same it will be more then we add that amount of tokens to the counter
          STATION_COUNTER[k].amount = TEAM_STATION[i][k];
          // We empty the team array and add the team
          // Since the team have more and will be the only team with that amount
          STATION_COUNTER[k].team = [];
          STATION_COUNTER[k].team.push(i);
        }
      }
    }
  }

  // Calculate the amount of points each team will recieve from that specific station
  for (let token = 0; token < tokens.length; token += 1) {
    // Checking if theres more than one team in the team array
    // If there is more none will get a point from that token
    if (STATION_COUNTER[token].team.length === 1) {
      const { team } = STATION_COUNTER[token];
      // Will get the amount of multiplication from the station
      const STATION_MULTIPLIER = THE_STATION.properties.salaryMultiplier;
      // Will get the amount of multiplication from the team
      const TEAM_MULTIPLIER = teams[team].properties.salaryMultiplier;
      // The defualt score for having the most tokens is 1
      let score = 1;
      // Since spells can affect stations or teams we have to multiply twice
      // Multiplying with the stations multiplier
      score *= STATION_MULTIPLIER;
      // Multiplying with the team multiplier
      score *= TEAM_MULTIPLIER;

      // Add amount of score that the teams will get in total to our score counter
      SCORE_COUNTER[team] += score;
    }
  }

  return SCORE_COUNTER;
}

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

function getCurrTeamScores(game) {
  // Unpack the teams from the recieved gamestate
  const { teams } = game;

  // Create a empty object
  const currTeamScores = {};

  // Loop through all teams and add a property to the object for each team which
  // has the team's index as key and their score as value
  for (let i = 0; i < teams.length; i++) {
    currTeamScores[i] = teams[i].properties.score;
  }

  // Return the now filled object
  return currTeamScores;
}

module.exports = {
  getTickDuration,
  getTeamSalaries,
  getSalaryByStation,
  getLoginTime,
  getCurrTeamScores,
};
