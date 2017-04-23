import { select, call, put } from 'redux-saga/effects';
import AuthActions, { isLoggedIn, getUserInfo } from '../redux/Auth';

import fbPromise from './firebasePromiseProxy';
import firebase from '../firebase';

export function * startupAuth() {
  const loggedIn = yield select(isLoggedIn);
  
  // No need to check if we are somehow logged in already...
  if (!loggedIn) {
    try {
      // Attempt to see if we just re-directed from a sign-in
      const result = yield call(fbPromise, firebase.auth().getRedirectResult());
      
      if (result.user) {
        
        // Extract user details and send to Auth Store
        const {user, credential} = result;
        yield put(AuthActions.setCredentials({
          user,
          credential,
        }));
      }
    } catch (error) {
      yield put(AuthActions.loginError(error));
    }
  } else {
    
    /*
      Currently it is believed there is no need to worry about token refresh since firebase makes assurances using the
      long-lived refresh token it stores in the user object.
      
      This means we should not use the stored user object for api access. firebase.auth().currentUser should be used
      for that.
     */
    
    // Verify user logged in to Firebase is consistent with the user we know is logged in
    const loggedInUser = firebase.auth().currentUser;
    const { user, credential } = yield select(getUserInfo);
    
    if (user.uid === loggedInUser.uid) {
      // Ensure user details are consistent
      yield put(AuthActions.setCredentials({ user: loggedInUser, credential }));
    } else {
      // Logout current user and retry Auth Startup
      yield put(AuthActions.logout());
      yield put(AuthActions.startupAuth());
    }
  }
}