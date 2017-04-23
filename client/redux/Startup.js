import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';

const Types = keyMirror({
  STARTUP_PERSIST: null,
  STARTUP_AUTH: null,
});

const Creators = {
  startupPersist: () => ({type: Types.STARTUP_PERSIST}),
  startupAuth: () => ({type: Types.STARTUP_AUTH}),
};

export const StartupTypes = Types;
export default Creators;

const INITIAL_STATE = Immutable({
  persistStarted: false,
  authStarted: false,
});

const startupPersist = (state) => state.merge({ persistStarted: true });
const startupAuth = (state) => state.merge({ authStarted: true });

export const reducer = (state = INITIAL_STATE, action) => {
  const { type } = action;
  
  switch (type) {
    case Types.STARTUP_PERSIST:
      return startupPersist(state);
    case Types.STARTUP_AUTH:
      return startupAuth(state);
    default:
      return state;
  }
};