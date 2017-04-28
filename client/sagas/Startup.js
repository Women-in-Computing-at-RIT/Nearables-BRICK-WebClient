import { select, call, put, take } from 'redux-saga/effects';

import invariant from 'invariant';
import warning from 'warning';

import AuthActions, { isLoggedIn, getUserInfo } from '../redux/Auth';
import StartupActions, { StartupTypes } from '../redux/Startup';

import fbProxy from './firebasePromiseProxy';
import { organizerPhotos, organizerDefaultPhoto } from '../lib/BrickRefs';
import firebase from '../firebase';

function fetchPhotoUrl({ uid, photoURL }) {
  invariant(uid != null, 'Provided uid is null/undefined value.');
  invariant(photoURL != null, 'Provided photoURL is null/undefined value.');
  
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
  
  // If we are already logged in... then that's strange but logout the current user if they are not the same.
  if (loggedIn) {
    const { user: storedUser } = yield select(getUserInfo);
    if (storedUser.id !== user.id)
      yield put(AuthActions.logout());
  } else if(loggedIn && !user) {
    // Logged Out
    yield put(AuthActions.logout());
  }
  
  try {
    user.photoURL = yield call(fetchPhotoUrl, user);
  } catch(e) {
    // Photo URL Could not be retrieved
    warning(!e, 'Unexpected error attempting to fetch photo url');
    warning(!e, e);
  }
  
  try {
    if (user)
      yield put(AuthActions.setCredentials({user}));
  
    yield put(StartupActions.startupAuthDone());
  } catch (e) {
    yield put(AuthActions.loginError(e));
  }
}
