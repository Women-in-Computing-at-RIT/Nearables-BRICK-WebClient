import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';

import PersistConfig from '../config/ReduxPersistConfig';

export const StartupTypes = keyMirror({
  STARTUP_PERSIST: null,
  STARTUP_AUTH: null,
  STARTUP_AUTH_DONE: null,
});

const Creators = {
  startupPersist: () => ({type: StartupTypes.STARTUP_PERSIST}),
  startupAuth: (user) => ({type: StartupTypes.STARTUP_AUTH, payload: { user }}),
  startupAuthDone: () => ({type: StartupTypes.STARTUP_AUTH_DONE}),
};

export default Creators;

const INITIAL_STATE = Immutable({
  persistStarted: !PersistConfig.active,
  authStarted: false,
});

const startupPersist = (state) => state.merge({ persistStarted: true });
const startupAuth = (state) => state.merge({ authStarted: true });

export const reducer = (state = INITIAL_STATE, action) => {
  const { type } = action;
  
  switch (type) {
    case StartupTypes.STARTUP_PERSIST:
      return startupPersist(state);
    case StartupTypes.STARTUP_AUTH_DONE:
      return startupAuth(state);
    default:
      return state;
  }
};

export const isFullyLoaded = (state) => {
  const values = Object.values(state.startup);
  
  for (const v of values)
    if (!v)
      return false;
  
  return true;
};
