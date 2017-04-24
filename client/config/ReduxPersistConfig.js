import immutablePersistenceTransform from '../services/ImmutablePersistenceTransform';
import localForage from 'localforage';

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '4',
  storeConfig: {
    storage: localForage,
    blacklist: ['startup', 'auth.user'],
    transforms: [immutablePersistenceTransform],
  },
};

export default REDUX_PERSIST;