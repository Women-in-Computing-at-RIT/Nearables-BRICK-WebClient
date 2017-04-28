/* eslint-disable no-constant-condition */
import { eventChannel } from 'redux-saga';
import { call, put, cancelled, take } from 'redux-saga/effects';

import EventActions from '../redux/Event';

import RefPaths, { RefEvents, organizerEvents, event, eventBase } from '../lib/BrickRefs';
import fbProxy from './firebasePromiseProxy';
import firebase from '../firebase';

function setupChannelForEvents(user) {
  return eventChannel(emitter => {
    const eventRef = firebase.database().ref(organizerEvents(user));
    
    let addHandler, rmHandler;
    
    // Listen for new events being added remotely.
    eventRef.on(RefEvents.CHILD_ADDED, (addHandler = (snapshot) => {
      const id = snapshot.key;
      firebase.database().ref(event({ id })).once(RefEvents.VALUE)
        .then((data) => {
          const event = data.val();
          emitter(EventActions.addEventDbCallback(event));
        });
    }));
    
    // Listen for events being removed remotely.
    eventRef.on(RefEvents.CHILD_REMOVED, (rmHandler = (snapshot) => {
      const id = snapshot.key;
      emitter(EventActions.removeEventDbCallback({ id }));
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
  
  const orgEventsRef = firebase.database().ref(organizerEvents(user));
  const eventRef = firebase.database().ref(eventBase());
  
  // Get Initial List of All Known Events
  const knownEventIds = yield call(fbProxy, orgEventsRef.once(RefEvents.VALUE).then(snapshot => {
    const ids = new Set();
    snapshot.forEach((childSnapshot) => ids.add(childSnapshot.key));
    return Promise.resolve(ids);
  }));
  
  const knownEvents = yield call(fbProxy, eventRef.once(RefEvents.VALUE).then(snapshot => {
    const events = [];
    snapshot.forEach((childSnapshot) => knownEventIds.has(childSnapshot.key) ? events.push(childSnapshot.val()) : null);
    
    return Promise.resolve(events);
  }));
  
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
