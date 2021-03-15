// Manages the client state
const Context = {
  // The state
  state: {},
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
    console.group('State Updated');
    console.log('%cPrevious', 'color: red;', currentState);
    console.log('Update with', next);
    console.log('%cNew state', 'color: #35b51a;', newState);
    console.groupEnd();

    // Set the new state
    this.state = newState;
  },
};

export default Context;
