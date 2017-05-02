/* eslint-disable no-constant-condition */
import { eventChannel } from 'redux-saga';
import { select, call, put, cancelled, take } from 'redux-saga/effects';

import invariant from 'invariant';

import BroadcastActions, { shouldBeReceived } from '../redux/Broadcast';
import { getCurrentEvent } from '../redux/Event';
import { Event, Broadcast } from '../lib/objects';

import RefPaths, { RefEvents } from '../lib/refs';

import fbProxy from './firebasePromiseProxy';
import firebase from '../firebase';

export function * sendBroadcast({ payload }) {
  const { /** @type Broadcast */ broadcast } = payload;
  
  /**
   * @type {Event}
   */
  const event = yield select(getCurrentEvent);
  const broadcastRef = firebase.database().ref(RefPaths.eventBroadcasts({ id: event.id })).child(broadcast.id);
  
  try {
    yield call(fbProxy, broadcastRef.set(broadcast.toJSON()));
    yield put(BroadcastActions.receiveOwnBroadcast(broadcast));
  } catch (e) {
// eslint-disable-next-line no-console
    console.error(e);
  }
}

/**
 * @param {Event} event
 */
export function * getBroadcastHistory({ event }) {
  if(!event)
    event = yield select(getCurrentEvent);
  
  invariant(event != null, 'Unexpected call to getBroadcastHistory with undefined/null event');
  
  const id = event.id;
  const broadcastRef = firebase.database().ref(RefPaths.eventBroadcasts({ id }));
  
  // Collect Broadcasts for History
  const history = yield call(fbProxy, broadcastRef.once(RefEvents.VALUE).then(snapshot =>
    Promise.resolve(Object.values(snapshot.val() || {}))
  ));
  
  // Set History
  
  if(history && history.length > 0)
    yield put(BroadcastActions.setBroadcastHistory(history));
  else
    yield put(BroadcastActions.clearBroadcastHistory());
}

export function * loadAndListenBroadcasts({ payload }) {
  
  const { event } = payload;
  
  // Load Current History
  
  yield put(BroadcastActions.getBroadcastHistory(event));
  
  // Listen for New Broadcasts
  
  const channel = yield call(setupBroadcastChannel, event.id);
  try {
    while (true) {
      const action = yield take(channel);
      
      const { payload } = action;
      const { broadcast } = payload;
      
      const isNewEnough = yield select((state) => shouldBeReceived(state, broadcast));
      
      if (isNewEnough)
        yield put(action);
    }
  } finally {
    if (cancelled())
      channel.close();
  }
  
}

function setupBroadcastChannel(id) {
  return eventChannel(emitter => {
    const broadcastRef = firebase.database().ref(RefPaths.eventBroadcasts({ id }));
    
    let addHandler;
    
    broadcastRef.on(RefEvents.CHILD_ADDED, addHandler = (snapshot) => {
      const broadcast = new Broadcast(snapshot.val());
      emitter(BroadcastActions.receiveBroadcast(broadcast));
    });
    
    return () => {
      broadcastRef.off(RefEvents.CHILD_ADDED, addHandler);
    };
  });
}
