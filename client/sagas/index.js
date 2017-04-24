import { takeLatest } from 'redux-saga/effects';

import { StartupTypes } from '../redux/Startup';
import { AuthTypes } from '../redux/Auth';

import { onAuthSaga } from './General';
import { startupAuth } from './Startup';

export default function * root() {
  yield [
    // Startup Sagas
    takeLatest(StartupTypes.STARTUP_AUTH, startupAuth),
    
    // General Sagas (last in sequence)
    // Listen for new credentials and fire off some Authentication
    // dependent actions that would be great to start early.
    takeLatest(AuthTypes.SET_CREDENTIALS, onAuthSaga),
  ];
}