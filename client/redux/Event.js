import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';

import ensureJson from './ensureJson';

const Types = keyMirror({
  GET_EVENTS: null,
  SET_EVENTS: null,
  SET_EVENT: null,
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

Creators.setEvent = (event) => ({
  type: Types.SET_EVENT,
  payload: {
    event: ensureJson(event),
  },
});

export const EventTypes = Types;
export default Creators;

const INITIAL_STATE = Immutable({
  ready: true,
  availableEvents: [],
  currentEvent: null,
});

const getEvents = (state) => state.merge({ ready: false });
const setEvents = (state, { events }) => state.merge({ availableEvents: events, ready: true });
const setCurrentEvent = (state, { event }) => state.merge({ currentEvent: event.toJSON ? event.toJSON() : event, ready: true });

export const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  
  switch(type) {
    case Types.GET_EVENTS:
      return getEvents(state, payload);
    case Types.SET_EVENTS:
      return setEvents(state, payload);
    case Types.SET_EVENT:
      return setCurrentEvent(state, payload);
    default:
      return state;
  }
};

export const isFullyReady = (state) => isReady(state) && hasCurrentEvent(state);
export const isReady = (state) => state.events.ready;
export const getAvailableEvents = (state) => state.events.availableEvents;
export const getCurrentEvent = (state) => state.events.currentEvent;
export const hasCurrentEvent = (state) => !!getCurrentEvent(state);
