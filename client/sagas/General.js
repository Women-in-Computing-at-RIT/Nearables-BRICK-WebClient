/* eslint-disable no-constant-condition */
import { put, call } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

import EventActions from '../redux/Event';
import firebase from '../firebase';

import fbProxy from './firebasePromiseProxy';
import ensureJson from '../redux/ensureJson';
import { organizer } from '../services/BrickUtil';

/**
 * Takes a user and updates their organizer profile with the latest data. This boils down to a set call on
 * the organizer ref.
 *
 * @param user User to update
 */
function * updateUserRef(user) {
  const userRef = firebase.database().ref(organizer(user));
  
  yield call(fbProxy, userRef.set(ensureJson(user)));
}

export function * onAuthSaga({ payload }) {
  const { user } = payload;
  
  yield* updateUserRef(user);
  
  yield [
    put(EventActions.getEvents(user)),
  ];
}

export function * onLogout({ payload }) {
  yield [
    put(replace('/')),
  ];
}