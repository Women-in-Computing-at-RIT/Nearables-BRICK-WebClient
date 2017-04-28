import keyMirror from 'keymirror';
import Immutable from 'seamless-immutable';

import ensureJson from './ensureJson';
import R, {map, propEq, reject, when} from 'ramda';

export const EventTypes = keyMirror({
  GET_EVENTS: null,
  SET_EVENTS: null,
  SET_CURRENT_EVENT: null,
  
  ADD_EVENT: null,
  SET_EVENT: null,
  RM_EVENT : null,
});

const Creators = {};

Creators.getEvents = (user) => ({
  type: EventTypes.GET_EVENTS,
  payload: {
    user,
  },
});

Creators.setEvents = (events) => ({
  type: EventTypes.SET_EVENTS,
  payload: {
    events: ensureJson(events) || [],
  },
});

Creators.setCurrentEvent = (event) => ({
  type: EventTypes.SET_CURRENT_EVENT,
  payload: {
    event: ensureJson(event),
  },
});

const createAddEvent = (event, isNew) => ({
  type: EventTypes.ADD_EVENT,
  payload: {
    event: ensureJson(event),
    isNew,
  },
});

Creators.addEvent = (event) => createAddEvent(event, true);
Creators.addEventDbCallback = (event) => createAddEvent(event, false);

Creators.setEvent = (event) => ({
  type: EventTypes.SET_EVENT,
  payload: {
    event: ensureJson(event),
  },
});

const createRemoveEvent = (event, applyToDatabase) => ({
  type: EventTypes.RM_EVENT,
  payload: {
    event: ensureJson(event),
    applyToDatabase,
  },
});

Creators.removeEvent = (event) => createRemoveEvent(event, true);
Creators.removeEventDbCallback = (event) => createRemoveEvent(event, false);

export default Creators;

const INITIAL_STATE = Immutable({
  ready: true,
  availableEvents: [],
  currentEvent: null,
});

const replaceEvent = (event) => when(propEq('id', event.id), () => event);
const modifyEvent = (event, xs) => map(replaceEvent(event), xs);
const dropEvent = ({ id }, xs) => reject(propEq('id', id), xs);

const getEvents = (state) => state.merge({ ready: false });
const setEvents = (state, { events }) => state.merge({ availableEvents: events, ready: true });
const setCurrentEvent = (state, { event }) => state.merge({ currentEvent: event.toJSON ? event.toJSON() : event, ready: true });

const forceToSet = R.uniqWith(R.prop('id'));

const addEvent = (state, { event }) => state.merge({ availableEvents: forceToSet([ ...state.availableEvents, event ]) });
const setEvent = (state, { event }) => state.merge({ availableEvents: modifyEvent(event, state.availableEvents) });
const rmEvent = (state, { event }) => state.merge({ availableEvents: dropEvent(event, state.availableEvents) });

export const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  
  switch(type) {
    case EventTypes.GET_EVENTS:
      return getEvents(state, payload);
    case EventTypes.SET_EVENTS:
      return setEvents(state, payload);
    case EventTypes.SET_CURRENT_EVENT:
      return setCurrentEvent(state, payload);
    case EventTypes.ADD_EVENT:
      return addEvent(state, payload);
    case EventTypes.SET_EVENT:
      return setEvent(state, payload);
    case EventTypes.RM_EVENT:
      return rmEvent(state, payload);
    default:
      return state;
  }
};

export const isFullyReady = (state) => isReady(state) && hasCurrentEvent(state);
export const isReady = (state) => state.events.ready;
export const getAvailableEvents = (state) => [...state.events.availableEvents];
export const getCurrentEvent = (state) => state.events.currentEvent;
export const hasCurrentEvent = (state) => !!getCurrentEvent(state);
