import { select, call, put } from 'redux-saga/effects';
import AuthActions, { isLoggedIn } from '../redux/Auth';

import firebase from '../firebase';

export function * startupAuth() {
  const loggedIn = yield select(isLoggedIn);
  
  // No need to check if we are somehow logged in already...
  if (!loggedIn) {
    try {
      // Attempt to see if we just re-directed from a sign-in
      const result = yield call(getRedirectResult);
      if (result.user) {
        // Extract user details and send to Auth Store
        const {email, displayName, photoURL: photoUrl, emailVerified: verified, uid} = result.user;
        const {credential} = result;
    
        yield put(AuthActions.setUser({
          email,
          displayName,
          photoUrl,
          verified,
          uid,
          credential,
        }));
      }
    } catch (error) {
      yield put(AuthActions.loginError(error));
    }
  }
}

function getRedirectResult() {
  return new Promise((resolve, reject) => {
    firebase.auth().getRedirectResult()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}