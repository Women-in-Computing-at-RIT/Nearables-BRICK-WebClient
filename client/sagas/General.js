/* eslint-disable no-constant-condition */
import { put, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { replace } from 'react-router-redux';

import invariant from 'invariant';

import EventActions from '../redux/Event';
import AuthActions, { getUser, isLoggedIn } from '../redux/Auth';
import firebase from '../firebase';

import fbProxy from './firebasePromiseProxy';
import ensureJson from '../redux/ensureJson';
import { organizer, organizerPhotos } from '../lib/refs';

/**
 * Takes a user and updates their organizer profile with the latest data. This boils down to a set call on
 * the organizer ref.
 *
 * @param user User to update
 */
function * updateUserRef(user) {
  invariant(user != null, 'Given a null/undefined value instead of user.');
  const userRef = firebase.database().ref(organizer(user));
  
  yield call(fbProxy, userRef.set(ensureJson(user)));
}

function * checkPhotoUrl(user) {
  invariant(user != null, 'Given a null/undefined value instead of user.');
  
  const photoRef = firebase.storage().ref(organizerPhotos(user));
  const photoURL = decodeURIComponent(user.photoURL);

  // Wait for at most .5*(k+1)(2x+sk) milliseconds
  // With min wait time of x
  // With max wait time of x + sk
  // if k = 5, x = 500 and s = 500, we spend at most 10,500 milliseconds here
  let attempts = 0;
  const maxAttempts =  15;  // k
  const delayTime   = 500;  // x
  const stepTime    = 200;  // s
  
  /*
    If the URL doesn't appear in the given timeframe it is essentially useless to load now, and endlessly polling is
    not ideal (GCS does not provide a reactive solution), so we stop polling and accept the fact the image won't appear
    until next page refresh (if the photo becomes available, otherwise this repeats).
   */
  const needsImageRegex = /^(?:\/photos\/organizers\/(?:.*\/)?default)$/g;
  while (attempts < maxAttempts && needsImageRegex.test(photoURL)) {
    try {
      const url = yield call(fbProxy, photoRef.getDownloadURL());
      if (url)
        yield put(AuthActions.setPhotoUrl(url));
      break;
    } catch (e) {
      yield call(delay, delayTime + stepTime * attempts);
      attempts++;
    }
  }
}

export function * onAuthSaga() {
  const loggedIn = yield select(isLoggedIn);
  
  if (!loggedIn)
    return;
  
  const user = yield select(getUser);
  
  yield* updateUserRef(user);
  
  yield [
    call(checkPhotoUrl, user),
    put(EventActions.getEvents(user)),
  ];
}

export function * onLogout() {
  firebase.auth().signOut();
  
  yield [
    put(replace('/')),
  ];
}
