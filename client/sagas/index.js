import { takeLatest, takeEvery } from 'redux-saga/effects';

import { StartupTypes } from '../redux/Startup';
import { AuthTypes } from '../redux/Auth';
import { EventTypes } from '../redux/Event';

import { onAuthSaga, onLogout } from './General';
import { startupAuth } from './Startup';
import { loadAndListenEvents, addEventToRemote, removeEventFromRemote } from './Event';

export default function * root() {
  yield [
    // Startup Sagas
    takeLatest(StartupTypes.STARTUP_AUTH, startupAuth),
    
    // Event Sagas
    takeLatest(EventTypes.GET_EVENTS, loadAndListenEvents),
    takeEvery(EventTypes.ADD_EVENT, addEventToRemote),
    takeEvery(EventTypes.RM_EVENT, removeEventFromRemote),
    
    // General Sagas (last in sequence)
    // Listen for new credentials and fire off some Authentication
    // dependent actions that would be great to start early.
    takeLatest(AuthTypes.SET_CREDENTIALS, onAuthSaga),
    takeLatest(AuthTypes.LOGOUT, onLogout),
  ];
}