import { select, call, put, take } from 'redux-saga/effects';

import AuthActions, { isLoggedIn, getUserInfo } from '../redux/Auth';
import StartupActions, { StartupTypes } from '../redux/Startup';

import fbProxy from './firebasePromiseProxy';
import { organizerPhotos, organizerDefaultPhoto } from '../lib/BrickRefs';
import firebase from '../firebase';

function fetchPhotoUrl({ uid, photoURL }) {
  const userPhotoRef = firebase.storage().ref(organizerPhotos({ uid }));
  const defaultPhotoRef = firebase.storage().ref(organizerDefaultPhoto());
  
  return new Promise((resolve, reject) => {
    userPhotoRef.getDownloadURL().then(resolve, reject);
  }).catch(() => {
    return fbProxy(defaultPhotoRef.getDownloadURL());
  }).catch(() => Promise.resolve(photoURL));
}


export function * startupAuth({ payload: { user: userData } }) {
  const persistDone = yield select((state) => state.startup.persistStarted);
  const user = userData ? userData.toJSON() : null;
  
  if (!persistDone)
    yield take(StartupTypes.STARTUP_PERSIST);
  
  const loggedIn = yield select(isLoggedIn);
  
  // No need to check if we are somehow logged in already...
  if (!loggedIn && user) {
    try {
      user.photoURL = yield call(fetchPhotoUrl, user);
      
      // Extract user details and send to Auth Store
      yield put(AuthActions.setCredentials({
        user,
        credential: null,
      }));
      yield put(StartupActions.startupAuthDone());
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
    
    if (user.uid === loggedInUser.uid) {
      // Ensure user details are consistent
      yield put(AuthActions.setCredentials({ user: loggedInUser, credential }));
    } else {
      // Logout current user and retry Auth Startup
      yield put(AuthActions.logout());
      yield put(AuthActions.startupAuth());
    }
  } else {
    yield put(AuthActions.logout());
    yield put(StartupActions.startupAuthDone());
  }
}