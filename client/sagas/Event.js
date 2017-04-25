/* eslint-disable no-constant-condition */
import { eventChannel } from 'redux-saga';
import { call, put, cancelled, take } from 'redux-saga/effects';

import EventActions from '../redux/Event';

import RefPaths, { RefEvents, organizerEvents } from '../services/BrickUtil';
import fbProxy from './firebasePromiseProxy';
import firebase from '../firebase';

function setupChannelForEvents(user) {
  return eventChannel(emitter => {
    const eventRef = firebase.database().ref(organizerEvents(user));
    
    let addHandler, rmHandler;
    
    // Listen for new events being added remotely.
    eventRef.on(RefEvents.CHILD_ADDED, (addHandler = (snapshot) => {
      const event = snapshot.val();
      emitter(EventActions.addEventDbCallback(event));
    }));
    
    // Listen for events being removed remotely.
    eventRef.on(RefEvents.CHILD_REMOVED, (rmHandler = (snapshot) => {
      const event = snapshot.val();
      emitter(EventActions.removeEventDbCallback(event));
    }));
    
    // Unsubscribe Function
    // Stop listening for added and removed events.
    return () => {
      eventRef.off(RefEvents.CHILD_ADDED, addHandler);
      eventRef.off(RefEvents.CHILD_REMOVED, rmHandler);
    };
  });
}

export function * loadAndListenEvents({ payload }) {
  const { user } = payload;
  
  const eventRef = firebase.database().ref(organizerEvents(user));
  
  // Get Initial List of All Known Events
  const knownEvents = yield call(fbProxy, eventRef.once(RefEvents.VALUE));
  yield put(EventActions.setEvents(knownEvents));
  
  // Set up Event Channel for adding/removing events remotely
  const chan = yield call(setupChannelForEvents, user);
  
  // Forward actions from the event channel straight to redux
  try {
    while (true) {
      const action = yield take(chan);
      yield put(action);
    }
  } finally {
    // Clean up
    if (cancelled())
      chan.close();
  }
}

export function * addEventToRemote({ payload }) {
  const { event, isNew } = payload;
  
  if (isNew) {
    if (!event.id)
      event.id = firebase.database().ref(RefPaths.eventBase()).push().key;
  
    const eventRef = firebase.database().ref(RefPaths.event(event));
    yield call(fbProxy, eventRef.set(event));
  }
}

export function * removeEventFromRemote({ payload }) {
  const { event, applyToDatabase } = payload;
  
  if(applyToDatabase) {
    if (!event.id)
      event.id = firebase.database().ref(RefPaths.eventBase()).push().key;
  
    const eventRef = firebase.database().ref(RefPaths.event(event));
    yield call(fbProxy, eventRef.remove(event));
  }
}