import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';

import ensureJson from './ensureJson';
import { when, propEq, map, reject } from 'ramda';

const Types = keyMirror({
  GET_EVENTS: null,
  SET_EVENTS: null,
  SET_CURRENT_EVENT: null,
  
  ADD_EVENT: null,
  SET_EVENT: null,
  RM_EVENT : null,
});

const Creators = {};

Creators.getEvents = (user) => ({
  type: Types.GET_EVENTS,
  payload: {
    user,
  },
});

Creators.setEvents = (events) => ({
  type: Types.SET_EVENTS,
  payload: {
    events: ensureJson(events),
  },
});

Creators.setCurrentEvent = (event) => ({
  type: Types.SET_CURRENT_EVENT,
  payload: {
    event: ensureJson(event),
  },
});

const createAddEvent = (event, isNew) => ({
  type: Types.ADD_EVENT,
  payload: {
    event: ensureJson(event),
    isNew,
  },
});

Creators.addEvent = (event) => createAddEvent(event, true);
Creators.addEventDbCallback = (event) => createAddEvent(event, false);

Creators.setEvent = (event) => ({
  type: Types.SET_EVENT,
  payload: {
    event: ensureJson(event),
  },
});

const createRemoveEvent = (event, applyToDatabase) => ({
  type: Types.RM_EVENT,
  payload: {
    event: ensureJson(event),
    applyToDatabase,
  },
});

Creators.removeEvent = (event) => createRemoveEvent(event, true);
Creators.removeEventDbCallback = (event) => createRemoveEvent(event, false);

export const EventTypes = Types;
export default Creators;

const INITIAL_STATE = Immutable({
  ready: true,
  availableEvents: [],
  currentEvent: null,
});

const replaceEvent = (event) => when(propEq('id', event.id), () => event);
const modifyEvent = (event, xs) => map(replaceEvent(event), xs);
const dropEvent = ({ id }, xs) => reject(propEq('id', event.id), xs);

const getEvents = (state) => state.merge({ ready: false });
const setEvents = (state, { events }) => state.merge({ availableEvents: events, ready: true });
const setCurrentEvent = (state, { event }) => state.merge({ currentEvent: event.toJSON ? event.toJSON() : event, ready: true });

const addEvent = (state, { event }) => state.merge({ availableEvents: [ ...state.availableEvents, event ] });
const setEvent = (state, { event }) => state.merge({ availableEvents: modifyEvent(event, state.availableEvents) });
const rmEvent = (state, { event }) => state.merge({ availableEvents: dropEvent(event, state.availableEvents) });

export const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  
  switch(type) {
    case Types.GET_EVENTS:
      return getEvents(state, payload);
    case Types.SET_EVENTS:
      return setEvents(state, payload);
    case Types.SET_CURRENT_EVENT:
      return setCurrentEvent(state, payload);
    case Types.ADD_EVENT:
      return addEvent(state, payload);
    case Types.SET_EVENT:
      return setEvent(state, payload);
    case Types.RM_EVENT:
      return rmEvent(state, payload);
    default:
      return state;
  }
};

export const isFullyReady = (state) => isReady(state) && hasCurrentEvent(state);
export const isReady = (state) => state.events.ready;
export const getAvailableEvents = (state) => state.events.availableEvents;
export const getCurrentEvent = (state) => state.events.currentEvent;
export const hasCurrentEvent = (state) => !!getCurrentEvent(state);
