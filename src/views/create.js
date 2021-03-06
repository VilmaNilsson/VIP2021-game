import utils from '../utils';

function CreateView() {
  const el = document.createElement('div');
  el.id = 'create-view';

  el.innerHTML = `
    <h1>Game Setup</h1>
    <div id='error' class="pregame-errmsg"></div>

    <form>
      <div id='create-game-name'>
        <h3>Game Name</h3>
        <input class="pregame-input" id='create-game-name-input' type='text' name='name' placeholder='Choose Game Name' maxlength='10'>
      </div>
      <div id='real-life-gameplay'>
        We have a fun IRL version coming out soon!
      </div>
      <div id='create-game-teams'>
        <div id='create-game-nr-div' class="pregame-btn">
          <span>Number of teams: 4</span>
          <div id='create-game-nr-drop' class='create-game-nr-drop'></div>
        </div>
        <input id='create-game-nr-input' type='number' name='nrOfTeams' value='4' hidden>
      </div>
      <div id='create-game-mode'>
        <h3>Mode Settings</h3>
        <div id='game-mode'>
          <button class='pregame-btn game-mode-btn activeBtn' id='game-mode-basic'>Basic</button>
          <p>or</p>
          <button class='pregame-btn game-mode-btn' id='game-mode-advanced'>Advanced</button>
        </div>          
      </div>
      <div class='create-game-advanced'>
        <h2>Advanced Mode</h2>
        <label>
          Duration of plan phase
          <div id='advanced-plan' class='pregame-input create-game-inputs'></div>
          <input class='create-game-inputs' id='create-game-plan-input' type='number' name='planDuration' value='60' hidden>
        </label>
        <br>
        <label>
          Duration of play phase
          <div id='advanced-play' class='pregame-input create-game-inputs'></div>
          <input class='create-game-inputs' id='create-game-play-input' type='number' name='playDuration' value='300' hidden>
        </label>
        <br>
        <label>
          Landing Time
          <div id='advanced-land' class='pregame-input create-game-inputs'></div>
          <input class='create-game-inputs' id='create-game-landing-input' type='number' name='loginTimer' value='5' hidden>
        </label>
        <br>
      </div>
      <button class="pregame-btn" id='create-game-button' type='submit'>Create Game</button>
    </form>
    <div id='choose-overlay' class='choose-overlay'>
      <div id='choose-overlay-close'>
        <p id='choose-overlay-close-x'>+</p>
      </div>
      <div id='choose-overlay-container'>
        <h2>Choose duration</h2>
        <h4 id='duration-information'></h4>
        <div id='picker-container' class="pregame-input">
          <input class='inputFieldsOverlay' type='text' id='picker-frame-minutes' maxlength='2' onkeypress='return event.charCode >= 48 && event.charCode <= 57'>
          <p id='picker-seperator'>:</p>
          <input class='inputFieldsOverlay' type='text' id='picker-frame-seconds' maxlength='2' onkeypress='return event.charCode >= 48 && event.charCode <= 57'>
        </div>
        <div id='durationError'></div>
        <button class="pregame-btn" id='changedDurationsBtn'>OK</button>
      </div>
    </div>
  `;

  // Crew phase HTML
  // ===============
  // <label>
  //   Duration of crew phase
  //   <div id='advanced-crew' class='pregame-input create-game-inputs'></div>
  //   <input class='create-game-inputs' id='create-game-crew-input' type='number' name='crewDuration' value='30' hidden>
  // </label>
  // <br>

  // -------------------VARIABLES--------------------------------//
  const errorEl = el.querySelector('#error');
  const formEl = el.querySelector('form');
  const allInputs = el.querySelectorAll('.create-game-inputs');
  const nameInput = el.querySelector('#create-game-name-input');
  const teamNrInput = el.querySelector('#create-game-nr-input');
  const teamNrDiv = el.querySelector('#create-game-nr-div');
  const teamNrDropDown = el.querySelector('#create-game-nr-drop');
  // const durationCrewInput = el.querySelector('#create-game-crew-input');
  // const durationCrewDiv = el.querySelector('#advanced-crew');
  const durationPlanDiv = el.querySelector('#advanced-plan');
  const durationPlayDiv = el.querySelector('#advanced-play');
  const durationLandDiv = el.querySelector('#advanced-land');
  const durationPlanInput = el.querySelector('#create-game-plan-input');
  const durationPlayInput = el.querySelector('#create-game-play-input');
  const durationLandingInput = el.querySelector('#create-game-landing-input');
  const advancedSettingsBtn = el.querySelector('#game-mode-advanced');
  const advancedSettings = el.querySelector('.create-game-advanced');
  const basicSettingsBtn = el.querySelector('#game-mode-basic');

  const allValues = {
    nrTeams: {
      defaultValue: 4,
      maxValue: 4,
      currentVal: 4,
    },
    crewPhase: {
      defaultValue: 30, // in seconds
      maxValue: '06:00', // in minutes
      currentVal: 30,
    },
    planPhase: {
      defaultValue: 60, // in seconds
      maxValue: '20:00', // in minutes
      currentVal: 60,
      minValue: 20, // in this case it was requested to have another minvalue than the default
    },
    playPhase: {
      defaultValue: 300, // in seconds
      maxValue: '59:59', // in minutes
      currentVal: 300,
    },
    landingTime: {
      defaultValue: 5, // in seconds
      maxValue: '01:00', // in minutes
      currentVal: 5,
    },
  };

  const overlay = el.querySelector('#choose-overlay');
  const overlayClose = el.querySelector('#choose-overlay-close-x');
  const overlayMinutesPicker = el.querySelector('#picker-frame-minutes');
  const overlaySecondsPicker = el.querySelector('#picker-frame-seconds');
  const durationInformation = el.querySelector('#duration-information');
  const overlayInputs = el.querySelectorAll('.inputFieldsOverlay');
  const overlayBtn = el.querySelector('#changedDurationsBtn');
  const durationError = el.querySelector('#durationError');

  let minVal;
  let maxVal;
  let chosenPhase;

  // ------------------------FUNCTIONS---------------------------//

  // converts to seconds
  function convertToSeconds(val) {
    val = val.split(':'); // split the string into array with min & sec
    const inSeconds = (Number(val[0]) * 60) + Number(val[1]);
    return inSeconds;
  }

  // converts seconds to minutes:seconds
  function convertToMinutesSeconds(val) {
    // Minutes & seconds
    // const mins = ~~((val % 3600) / 60); // ~~ == double NOT bitwise operator (math.floor)
    // const secs = ~~val % 60;
    const mins = Math.floor((val % 3600) / 60);
    const secs = Math.floor(val % 60);

    // create output like 50:30 or 00:30 or 00:07
    let ret = ''; // make it to a string

    // if the minutes are between 0 and 10 we need 1x 0
    // else only minutes and seconds
    if (mins >= 0 && mins < 10) {
      ret = `0${mins}:${secs < 10 ? `0${secs}` : secs}`;
      // ret += '0' + mins + ':' + (secs < 10 ? `0${secs}` : secs);
    } else {
      // ret += mins + ':' + (secs < 10 ? `0${secs}` : secs);
      ret = `${mins}:${secs < 10 ? `0${secs}` : secs}`;
    }
    return ret;
  }

  // generates a random name
  function gameNameGenerator() {
    const randomName = `game#${Math.floor(1000 + Math.random() * 9000)}`;
    nameInput.value = randomName;
    // nameInput.setAttribute('placeholder', randomName);
  }

  // creates the divs for the number of teams
  function createTeamNrDivs() {
    for (let i = 1; i <= allValues.nrTeams.maxValue; i += 1) {
      const nDiv = document.createElement('div');
      nDiv.innerText = i;
      nDiv.classList.add('team-divs');
      nDiv.addEventListener('click', (e) => {
        e.preventDefault();
        teamNrDiv.firstElementChild.innerText = `Number of teams: ${e.target.innerText}`;
        teamNrInput.value = e.target.innerText;
        allValues.nrTeams.currentVal = e.target.innerText;
      });
      teamNrDropDown.append(nDiv);
    }
  }

  // creates the divs in the overlay
  function createElementsPicker(currentVal, inputId) {
    // currentVal = currentValue in seconds
    // inputId = the input that is connected to the clicked div
    // maxValue = is collected by checking the type of input

    switch (inputId) {
      case 'advanced-crew':
        maxVal = allValues.crewPhase.maxValue;
        chosenPhase = 'Crew Phase';
        minVal = convertToMinutesSeconds(allValues.crewPhase.defaultValue);
        break;
      case 'advanced-plan':
        maxVal = allValues.planPhase.maxValue;
        chosenPhase = 'Plan Phase';
        minVal = convertToMinutesSeconds(allValues.planPhase.minValue);
        break;
      case 'advanced-play':
        maxVal = allValues.playPhase.maxValue;
        chosenPhase = 'Play Phase';
        minVal = convertToMinutesSeconds(allValues.playPhase.defaultValue);
        break;
      case 'advanced-land':
        maxVal = allValues.landingTime.maxValue;
        chosenPhase = 'Landing Time';
        minVal = convertToMinutesSeconds(allValues.landingTime.defaultValue);
        break;
      default:
        return;
    }
    durationInformation.innerText = `For the ${chosenPhase} choose a duration between ${minVal} minutes and ${maxVal} minutes`;
  }

  // updates the divs with the advanced durations
  // changes the input values for the payload
  function updateDurationDivValue(bool = false) {
    if (bool) { // the default values when chosen basic mode (calling with true)
      // durationCrewDiv.innerText = convertToMinutesSeconds(allValues.crewPhase.defaultValue);
      // durationCrewInput.value = allValues.crewPhase.defaultValue;

      durationPlanDiv.innerText = convertToMinutesSeconds(allValues.planPhase.defaultValue);
      durationPlanInput.value = allValues.planPhase.defaultValue;

      durationPlayDiv.innerText = convertToMinutesSeconds(allValues.playPhase.defaultValue);
      durationPlayInput.value = allValues.playPhase.defaultValue;

      durationLandDiv.innerText = convertToMinutesSeconds(allValues.landingTime.defaultValue);
      durationLandingInput.value = allValues.landingTime.defaultValue;
    } else {
      // durationCrewDiv.innerText = convertToMinutesSeconds(allValues.crewPhase.currentVal);
      // durationCrewInput.value = allValues.crewPhase.currentVal;

      durationPlanDiv.innerText = convertToMinutesSeconds(allValues.planPhase.currentVal);
      durationPlanInput.value = allValues.planPhase.currentVal;

      durationPlayDiv.innerText = convertToMinutesSeconds(allValues.playPhase.currentVal);
      durationPlayInput.value = allValues.playPhase.currentVal;

      durationLandDiv.innerText = convertToMinutesSeconds(allValues.landingTime.currentVal);
      durationLandingInput.value = allValues.landingTime.currentVal;
    }
  }

  // -----------------------EVENTS---------------------------//

  // handles the error codes
  errorEl.subscribe('game:create:fail', (e) => {
    // if the game doesn't have a name (already blocked but just in case)
    let createGameError;
    switch (e.detail.errorCode) {
      case 0:
        createGameError = 'Please enter a name for the game';
        break;
      case 1:
        createGameError = 'Check if you are logged in or already in a game';
        break;
      case 2:
        createGameError = 'A game with this name already exists';
        break;
      default:
        break;
    }
    errorEl.textContent = createGameError;
  });
  // shows the dropDown
  teamNrDiv.addEventListener('click', () => {
    teamNrDropDown.classList.toggle('showDropDown');
  });
  // shows box for making advanced settings
  advancedSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    basicSettingsBtn.classList.remove('activeBtn');
    // e.target.classList.toggle('activeBtn');
    e.target.classList.add('activeBtn');
    // display the values from the inputs in the divs
    advancedSettings.classList.toggle('advancedSettingsShow');
  });
  // if advanced settings opened, it gets closed
  // basic mode sets all the inputs to default values
  basicSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    advancedSettingsBtn.classList.remove('activeBtn');
    e.target.classList.add('activeBtn');
    // puts all the inputs back to default value
    // durationCrewInput.value = allValues.crewPhase.defaultValue;
    durationPlanInput.value = allValues.planPhase.defaultValue;
    durationPlayInput.value = allValues.playPhase.defaultValue;
    durationLandingInput.value = allValues.landingTime.defaultValue;
    // displays the default value in the divs
    updateDurationDivValue(true);
    advancedSettings.classList.remove('advancedSettingsShow');
  });
  // opens the overlay and adds the h2 and current value
  allInputs.forEach((input) => {
    input.addEventListener('click', (e) => {
      e.preventDefault();
      // console.log(e.target);
      // creates the divs for the picker-overlay
      createElementsPicker(e.target.innerText, e.target.id);
      overlay.classList.toggle('showOverlayDuration');
    });
  });

  // continues to the next input field when max length reached
  Array.prototype.forEach.call(overlayInputs, (e, index) => {
    e.addEventListener('keyup', (e) => {
      const maxlength = e.target.getAttribute('maxlength');
      const length = e.target.value.length;
      if (Number(maxlength) === length && index < (overlayInputs.length - 1)) {
        overlayInputs[index + 1].focus();
      }
    });
  });
  // closes the overlay for choosing duration
  overlayClose.addEventListener('click', () => {
    overlay.classList.toggle('showOverlayDuration');
  });
  // saves the new duration, makes some checks and closes overlay
  overlayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (overlayMinutesPicker.value.length < 1 || overlaySecondsPicker.value.length < 1) {
      durationError.innerText = 'Please fill in desired minutes and seconds';
      setTimeout(() => {
        durationError.innerText = '';
      }, 3000);
      return;
    }
    // if input fields are not empty
    const insertedDurationMinutes = (overlayMinutesPicker.value.length < 2) ? `0${overlayMinutesPicker.value}` : overlayMinutesPicker.value;
    const insertedDurationSeconds = (overlaySecondsPicker.value.length < 2) ? `0${overlaySecondsPicker.value}` : overlaySecondsPicker.value;
    const insertedDurationInSeconds = convertToSeconds(`${insertedDurationMinutes}:${insertedDurationSeconds}`);
    if (insertedDurationInSeconds < convertToSeconds(minVal)) {
      durationError.innerText = 'The duration is too short';
      setTimeout(() => {
        durationError.innerText = '';
      }, 3000);
    } else if (insertedDurationInSeconds > convertToSeconds(maxVal)) {
      durationError.innerText = 'The duration is too long';
      setTimeout(() => {
        durationError.innerText = '';
      }, 3000);
    } else {
      switch (chosenPhase) {
        case 'Crew Phase':
          allValues.crewPhase.currentVal = insertedDurationInSeconds;
          break;
        case 'Plan Phase':
          allValues.planPhase.currentVal = insertedDurationInSeconds;
          break;
        case 'Play Phase':
          allValues.playPhase.currentVal = insertedDurationInSeconds;
          break;
        case 'Landing Time':
          allValues.landingTime.currentVal = insertedDurationInSeconds;
          break;
        default:
          break;
      }
      overlay.classList.toggle('showOverlayDuration');
      overlayInputs.forEach((input) => {
        input.value = '';
      });
      updateDurationDivValue();
    }
  });
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    // TODO:
    if (nameInput.value.length < 1) {
      nameInput.style.boxShadow = '0 0 10px 2px var(--logo-color)';
      return;
    }

    const payload = utils.serializeForm(e.target);
    el.send('game:create', payload);
  });

  el.subscribe('game:yours', () => {
    el.navigate('/lobby');
  });

  gameNameGenerator(); // creates a random game name
  updateDurationDivValue(true); // updates the durations
  createTeamNrDivs(); // creates the dropdown for amount of teams
  return el;
}

export default {
  path: '/create',
  view: CreateView,
};
