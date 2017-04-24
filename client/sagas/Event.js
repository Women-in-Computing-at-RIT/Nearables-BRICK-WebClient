import { } from 'redux-saga/effects';

import fbProxy from './firebasePromiseProxy';
import firebase from '../firebase';

export function * loadEvents({ payload }) {
  const { user } = payload;
  
  // Actually should probably just listen for changes at a particular Reference point
  // have the function yield until another call is made and scrap the old reference and detach the listener.
  
  // That would be idiomatic, at least.
  
  // ACTUALLY EVENT CHANNELS!
  // ADVANCED SAGAS!
  
  // YEAH! A USE CASE!
  // Initial Load of All Known Events
  // Set up EventChannel for Listening to Future Events
  // Clean-up and Cycle on Re-Auth (SET_CREDENTIALS called again)
}