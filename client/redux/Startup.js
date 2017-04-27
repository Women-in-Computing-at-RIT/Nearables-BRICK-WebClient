import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';

import is from 'is_js';
import R from 'ramda';

import PersistConfig from '../config/ReduxPersistConfig';

const Types = keyMirror({
  STARTUP_PERSIST: null,
  STARTUP_AUTH: null,
  STARTUP_AUTH_DONE: null,
});

const Creators = {
  startupPersist: () => ({type: Types.STARTUP_PERSIST}),
  startupAuth: (user) => ({type: Types.STARTUP_AUTH, payload: { user }}),
  startupAuthDone: () => ({type: Types.STARTUP_AUTH_DONE}),
};

export const StartupTypes = Types;
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
    case Types.STARTUP_PERSIST:
      return startupPersist(state);
    case Types.STARTUP_AUTH_DONE:
      return startupAuth(state);
    default:
      return state;
  }
};

export const isFullyLoaded = (state) => {
  const values = Object.values(state.startup);
  return R.all(
    is.truthy,
    R.filter((x) => is.boolean(x), values)
  );
};