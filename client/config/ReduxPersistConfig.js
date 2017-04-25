import immutablePersistenceTransform from '../services/ImmutablePersistenceTransform';
import localForage from 'localforage';

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '2',
  storeConfig: {
    storage: localForage,
    blacklist: ['startup', 'events', 'router'],
    transforms: [immutablePersistenceTransform],
  },
};

export default REDUX_PERSIST;