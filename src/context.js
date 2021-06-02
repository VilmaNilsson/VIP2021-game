// Manages the client state
const Context = {
  // The state
  state: {},
  // Timers
  timeouts: [],
  intervals: [],
  // Fetches the state
  getState: function getState() {
    return this.state;
  },
  // Updates the state, can be called with a new object or with a function that
  // gets invoked with the current state
  setState: function setState(nextState) {
    // Make a copy of the current state for logging purposes
    const currentState = { ...this.state };

    // Get the new state (either an object or by invoking the callback)
    const next = typeof nextState === 'function'
      ? nextState(this.state)
      : nextState;

    // Our new state
    const newState = { ...this.state, ...next };

    // Lets log what state we had, the updates and the new state
    console.groupCollapsed('State updated');
    console.log('%cPrev', 'color: #888;', currentState);
    console.log('With', next);
    console.log('%cNext', 'color: #177503;', newState);
    console.groupEnd();

    // Set the new state
    this.state = newState;

    // Publish the new changes to our state
    this.publish('state:update', next);
  },
  // Wrapper function for storing values in localStorage
  setCache: (key, value) => {
    return window.localStorage.setItem(key, value);
  },
  // Wrapper function for fetching values from localStorage
  getCache: (key) => {
    return window.localStorage.getItem(key);
  },
  // Wrapper function for setting timeouts (that also get stored)
  setTimeout: function setTimeout(cb, ms = 0) {
    const timeout = window.setTimeout(cb, ms);
    this.timeouts = [...this.timeouts, timeout];
    return timeout;
  },
  // Wrapper function for setting intervals (that also get stored)
  setInterval: function setInterval(cb, ms = 10) {
    // Regular interval handler
    if (typeof cb === 'function') {
      const intervalId = window.setInterval(cb, ms);
      this.intervals = [...this.intervals, intervalId];
      return intervalId;
    }

    // The next step requires the `cb` to be an object
    if (typeof cb !== 'object') {
      // -1 since interval IDs are numbers
      return -1;
    }

    // NOTE: could do some more error handling
    const { start, duration, onTick, onEnd } = cb;
    // Future end time in seconds
    const endTime = start + duration;

    const interval = window.setInterval(() => {
      const timeLeft = endTime - Date.now();

      if (onTick !== undefined && typeof onTick === 'function') {
        const d = new Date(timeLeft);
        onTick({
          timestamp: timeLeft < 0 ? 0 : timeLeft,
          hours: d.getHours(),
          minutes: d.getMinutes(),
          seconds: d.getSeconds(),
          milliseconds: d.getMilliseconds(),
        });
      }

      if (timeLeft <= 0) {
        clearInterval(interval);
        
        if (onEnd !== undefined && typeof onEnd === 'function') {
          onEnd();
        }
      }
    }, ms);

    this.intervals = [...this.intervals, interval];
    return interval;
  },
  // Clear all stored timers (ie. when a game ends)
  clearTimers: function clearTimers() {
    this.timeouts.forEach(window.clearTimeout);
    this.intervals.forEach(window.clearInterval);
    this.timeouts = [];
    this.intervals = [];
  },
};

export default Context;
