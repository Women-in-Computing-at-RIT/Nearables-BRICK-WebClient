import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';
import R from 'ramda';

import { Broadcast } from '../lib/objects';

export const BroadcastTypes = keyMirror({
  RECEIVE_BROADCAST: null,
  SEND_BROADCAST: null,
  SET_BROADCAST_HISTORY: null,
  GET_BROADCAST_HISTORY: null,
  CLEAR_BROADCAST_HISTORY: null,
});

const Creators = {};

/**
 * @param {?{id: string}} event
 */
Creators.getBroadcastHistory = (event) => ({
  type: BroadcastTypes.GET_BROADCAST_HISTORY,
  payload: {
    event,
  },
});

/**
 * @param {Broadcast} broadcast
 */
Creators.receiveBroadcast = (broadcast) => ({
  type: BroadcastTypes.RECEIVE_BROADCAST,
  payload: {
    broadcast,
    self: false,
  },
});

/**
 * @param {Broadcast} broadcast
 */
Creators.receiveOwnBroadcast = (broadcast) => ({
  type: BroadcastTypes.RECEIVE_BROADCAST,
  payload: {
    broadcast,
    self: true,
  },
});

/**
 * @param {Broadcast} broadcast
 */
Creators.sendBroadcast = (broadcast) => ({
  type: BroadcastTypes.SEND_BROADCAST,
  payload: {
    broadcast,
  },
});

/**
 *
 * @param {[Broadcast]} broadcasts
 */
Creators.setBroadcastHistory = (broadcasts) => ({
  type: BroadcastTypes.SET_BROADCAST_HISTORY,
  payload: {
    broadcasts,
  },
});

Creators.clearBroadcastHistory = () => ({
  type: BroadcastTypes.CLEAR_BROADCAST_HISTORY,
});

export default Creators;

const INITIAL_STATE = Immutable({
  broadcastHistory: [],
});

/**
 * @template T
 * @type {function(Array<T>): Array<T>}
 */
const orderByTime = R.sortBy(R.prop('timestamp'));

/**
 * @type {function([Broadcast]):[Broadcast]}
 */
const forceToSet = (x) => {
  const knownIds = new Set();
  const result = [];
  for (const /** @type Broadcast */ elem of x) {
    if (!knownIds.has(elem.id)) {
      knownIds.add(elem.id);
      result.push(elem);
    }
  }
  return result;
};

/**
 * @param state
 * @param {[Broadcast]} broadcasts
 */
const setHistory = (state, { broadcasts }) => {
  /** @type {Array<Broadcast>} */
  const sorted = orderByTime(broadcasts);
  return state.merge({ broadcastHistory: forceToSet(sorted) });
};

const clearHistory = (state) => state.merge({ broadcastHistory: [] });

/**
 * @param state
 * @param {Broadcast} broadcast
 */
const receiveBroadcast = (state, { broadcast }) => state.merge({ broadcastHistory: forceToSet([...state.broadcastHistory, broadcast])});

export const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch(type) {
    case BroadcastTypes.SET_BROADCAST_HISTORY:
      return setHistory(state, payload);
    case BroadcastTypes.CLEAR_BROADCAST_HISTORY:
      return clearHistory(state, payload);
    case BroadcastTypes.RECEIVE_BROADCAST:
      return receiveBroadcast(state, payload);
    default:
      return state;
  }
};

/**
 * @param {*} x
 * @returns {?Broadcast}
 */
const lastOrNone = (x) =>
  R.ifElse(
    R.pipe(R.length, R.lt(0)),
    R.pipe(R.last, (x) => new Broadcast(x)),
    R.always(null)
  )(x);

/**
 * @param state
 * @returns {[Broadcast]} All Broadcasts in History
 */
export const getBroadcasts = (state) => R.map(x => new Broadcast(x), state.broadcasts.broadcastHistory);

/**
 * @param {{broadcasts: {broadcastHistory: Array<Broadcast>}}} state
 * @returns {?Broadcast} Most Recent Broadcast
 */
export const getLastBroadcast = (state) => lastOrNone(state.broadcasts.broadcastHistory);
export const hasBroadcasts = (state) => state.broadcasts.broadcastHistory.length > 0;

/**
 * @param state
 * @param {Broadcast} broadcast
 * @returns {boolean} True if timestamp greater than currently known most recent broadcast or true if
 * getLastBroadcast returns null. False otherwise.
 */
export const isNewerBroadcast = (state, broadcast) => {
  const last = getLastBroadcast(state);
  
  if (last == null)
    return true;
  else
    return last.timestamp < broadcast.timestamp;
};

/**
 * @param state
 * @param {Broadcast} broadcast
 *
 * @returns {boolean} True if same as most recent broadcast, false if not or if there is no most recent broadcast
 * i.e. getLastBroadcast returns null.
 */
export const isMostRecent = (state, broadcast) => {
  const lastBroadcast = getLastBroadcast(state);
  
  if (lastBroadcast == null)
    return false;
  
  return lastBroadcast.id === broadcast.id;
};

/**
 * @param state
 * @param {Broadcast} broadcast
 */
export const shouldBeReceived = (state, broadcast) => isNewerBroadcast(state, broadcast) && isMostRecent(state, broadcast);
