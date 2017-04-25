import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';
import is from 'is_js';

import ensureJson from './ensureJson';
import firebase from '../firebase';

const Types = keyMirror({
  LOGIN_REQUEST: null,
  LOGIN_ERROR: null,
  
  SET_CREDENTIALS: null,
  LOGOUT: null,
});

const Creators = {};

Creators.loginRequest = () => ({
  type: Types.LOGIN_REQUEST,
  payload: {},
});

Creators.loginError = (error) => ({
  type: Types.LOGIN_ERROR,
  payload: {
    error,
  },
});

Creators.setCredentials = ({ user, credential }) => ({
  type: Types.SET_CREDENTIALS,
  payload: {
    // Unless you plan on making ImmutableJS *real* upset, User must be a POJO.
    // This will at least automatically use Firebase's toJSON method if given a
    // firebase.User object.
    user: ensureJson(user),
    credential,
  },
});

Creators.logout = () => ({
  type: Types.LOGOUT,
  payload: {},
});

export const AuthTypes = Types;
export default Creators;

export const login = (state) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
  return state;
};

export const loginError = (state, { error }) => state.merge({ authError: error });
export const setCredentials = (state, { user, credential }) => state.merge({ user, credential });
export const logout = () => INITIAL_STATE;

const INITIAL_STATE = Immutable({
  authError: null,
  user: null,
  credential: null,
});

export function reducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  
  switch (type) {
    case Types.LOGIN_REQUEST:
      return login(state);
    case Types.LOGIN_ERROR:
      return loginError(state, payload);
    case Types.LOGOUT:
      return logout();
    case Types.SET_CREDENTIALS:
      return setCredentials(state, payload);
    default:
      return state;
  }
}

const selectAuthStore = (state) => is.existy(state.auth) ? state.auth : state;

export const isLoggedIn = (state) => !!selectAuthStore(state).user;

/**
 * Selects the User object from the state tree. NOTE: Do not use this user object for Firebase API access, use
 * `firebase.auth().currentUser` for that. This user object should still be in-sync info-wise.
 *
 * @param state
 */
export const getUser = (state) => selectAuthStore(state).user;

/**
 * Selects the stored credential object retrieved on sign-in. Wholly unreliable as an API token, working through
 * firebase APIs is recommended.
 *
 * @param state
 * @deprecated
 */
export const getCredential = (state) => selectAuthStore(state).credential;

/**
 * Selects bot the User object and Credential object stored from sign in. See getCredential and getUser for details.
 *
 * @param state
 * @deprecated
 */
export const getUserInfo = (state) => ({
  user: getUser(state),
  credential: getCredential(state),
});