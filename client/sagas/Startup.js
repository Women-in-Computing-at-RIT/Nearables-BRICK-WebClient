import { select, call, put, take } from 'redux-saga/effects';

import AuthActions, { isLoggedIn, getUserInfo } from '../redux/Auth';
import { StartupTypes } from '../redux/Startup';

import fbPromise from './firebasePromiseProxy';
import firebase from '../firebase';

export function * startupAuth({ payload: { user } }) {
  const persistDone = yield select((state) => state.startup.persistStarted);
  
  if (!persistDone)
    yield take(StartupTypes.STARTUP_PERSIST);
  
  const loggedIn = yield select(isLoggedIn);
  
  // No need to check if we are somehow logged in already...
  if (!loggedIn && user) {
    try {
      // Extract user details and send to Auth Store
      yield put(AuthActions.setCredentials({
        user,
        credential: null,
      }));
    } catch (e) {
      yield put(AuthActions.loginError(e));
    }
  } else if (user) {
    
    /*
      Currently it is believed there is no need to worry about token refresh since firebase makes assurances using the
      long-lived refresh token it stores in the user object.
      
      This means we should not use the stored user object for api access. firebase.auth().currentUser should be used
      for that.
     */
    
    // Verify user logged in to Firebase is consistent with the user we know is logged in
    const loggedInUser = user ? user : firebase.auth().currentUser;
    const { user, credential } = yield select(getUserInfo);
    
    if (user.updateProfile)
      yield call(fbPromise, user.updateProfile());
    
    if (user.uid === loggedInUser.uid) {
      // Ensure user details are consistent
      yield put(AuthActions.setCredentials({ user: loggedInUser, credential }));
    } else {
      // Logout current user and retry Auth Startup
      yield put(AuthActions.logout());
      yield put(AuthActions.startupAuth());
    }
  } else
    yield put(AuthActions.logout());
}