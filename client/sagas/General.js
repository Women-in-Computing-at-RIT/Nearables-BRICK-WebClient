/* eslint-disable no-constant-condition */
import { put } from 'redux-saga/effects';

import EventActions from '../redux/Event';


export function * onAuthSaga({ payload }) {
  const { user } = payload;
  
  yield [
    put(EventActions.getEvents(user)),
  ];
}