import { takeLatest } from 'redux-saga/effects';

import { StartupTypes } from '../redux/Startup';

import { startupAuth } from './Startup';

export default function * root() {
  yield [
    takeLatest(StartupTypes.STARTUP_AUTH, startupAuth),
  ];
}