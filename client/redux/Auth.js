import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';

import firebase from '../firebase';

const Types = keyMirror({
  LOGIN_REQUEST: null,
  LOGIN_ERROR: null,
  
  SET_USER: null,
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

Creators.setUser = (user) => ({
  type: Types.SET_USER,
  payload: {
    user,
  },
});

Creators.logout = () => ({
  type: Types.LOGOUT,
  payload: {},
});

export const AuthTypes = Types;
export default Creators;

export const login = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
};

export const loginError = (state, { error }) => state.merge({ fetching: false, authError: error });
export const setUser = (state, { user }) => state.merge({ fetching: false, user });
export const logout = () => INITIAL_STATE;

const INITIAL_STATE = Immutable({
  authError: null,
  user: null,
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
    case Types.SET_USER:
      return setUser(state, payload);
    default:
      return state;
  }
}

export const isLoggedIn = (state) => !!state.auth.user;
export const getUser = (state) => state.auth.user;