import { takeLatest } from 'redux-saga/effects';

import { StartupTypes } from '../redux/Startup';

import { startup } from './Startup';

export default function * root() {
  yield [
    takeLatest(StartupTypes.STARTUP, startup)
  ];
}