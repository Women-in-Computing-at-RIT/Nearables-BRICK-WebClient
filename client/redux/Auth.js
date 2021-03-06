import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';
import is from 'is_js';

import ensureJson from './ensureJson';
import firebase from '../firebase';

export const AuthTypes = keyMirror({
  LOGIN_REQUEST: null,
  LOGIN_ERROR: null,
  
  SET_CREDENTIALS: null,
  SET_PHOTO_URL: null,
  LOGOUT: null,
});

const Creators = {};

Creators.loginRequest = () => ({
  type: AuthTypes.LOGIN_REQUEST,
  payload: {},
});

Creators.loginError = (error) => ({
  type: AuthTypes.LOGIN_ERROR,
  payload: {
    error,
  },
});

Creators.setPhotoUrl = (url) => ({
  type: AuthTypes.SET_PHOTO_URL,
  payload: {
    photoURL: url,
  },
});

Creators.setCredentials = ({ user, credential }) => ({
  type: AuthTypes.SET_CREDENTIALS,
  payload: {
    // Unless you plan on making ImmutableJS *real* upset, User must be a POJO.
    // This will at least automatically use Firebase's toJSON method if given a
    // firebase.User object.
    user: ensureJson(user),
    credential,
  },
});

Creators.logout = () => ({
  type: AuthTypes.LOGOUT,
  payload: {},
});

export default Creators;

export const login = (state) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
  return state;
};

export const loginError = (state, { error }) => state.merge({ authError: error });
export const setCredentials = (state, { user, credential }) => state.merge({ user, credential });
export const logout = () => INITIAL_STATE;
export const setPhotoUrl = (state, { photoURL }) => state.merge({ user: Object.assign(state.user.asMutable(), { photoURL })});

const INITIAL_STATE = Immutable({
  authError: null,
  user: null,
  credential: null,
});

export function reducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  
  switch (type) {
    case AuthTypes.LOGIN_REQUEST:
      return login(state);
    case AuthTypes.LOGIN_ERROR:
      return loginError(state, payload);
    case AuthTypes.LOGOUT:
      return logout();
    case AuthTypes.SET_CREDENTIALS:
      return setCredentials(state, payload);
    case AuthTypes.SET_PHOTO_URL:
      return setPhotoUrl(state, payload);
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
