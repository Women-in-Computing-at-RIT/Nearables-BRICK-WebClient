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
 * @template T
 * @type {function(Array<T>):Array<T>}
 */
const forceToSet = R.uniqWith(R.prop('id'));

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

const lastOrNone =
  R.ifElse(
    R.pipe(R.length, R.lt(0)),
    R.last,
    R.always(null)
  );

/**
 * @param state
 * @returns {[Broadcast]} All Broadcasts in History
 */
export const getBroadcasts = (state) => state.broadcasts.broadcastHistory;

/**
 * @param {{broadcasts: {broadcastHistory: Array<Broadcast>}}} state
 * @returns {Broadcast} Most Recent Broadcast
 */
export const getLastBroadcast = (state) => lastOrNone(state.broadcasts.broadcastHistory);
export const hasBroadcasts = (state) => state.broadcasts.broadcastHistory.length > 0;

/**
 * @param state
 * @param {Broadcast} broadcast
 */
export const isNewerBroadcast = (state, broadcast) => getLastBroadcast(state).timestamp < broadcast.timestamp;

/**
 * @param state
 * @param {Broadcast} broadcast
 */
export const isMostRecent = (state, broadcast) => getLastBroadcast(state).id === broadcast.id;

/**
 * @param state
 * @param {Broadcast} broadcast
 */
export const shouldBeReceived = (state, broadcast) => isNewerBroadcast(state, broadcast) && isMostRecent(state, broadcast);
