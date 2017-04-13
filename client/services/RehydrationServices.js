import { persistStore } from 'redux-persist';
import * as localForage from 'localforage';

import ReduxPersist from '../config/ReduxPersistConfig';
import StartupActions from '../redux/Startup';

// Ensure proper reducer is used to store state.
// If the reducer used is outdated, clear the store since the state will be incompatible and update version
// Either way, setup persistence.
const updateReducers = (store) => {
    const {reducerVersion, storeConfig: config} = ReduxPersist;
    
    const startup = () => store.dispatch(StartupActions.startup());
    
    localForage.getItem('reducerVersion').then((localVersion) => {
        if(localVersion !== reducerVersion) {
            persistStore(store, config, startup).purge();
            localForage.setItem('reducerVersion', reducerVersion);
        } else
            persistStore(store, config, startup);
    }).catch(() => {
        persistStore(store, config, startup);
        localForage.setItem('reducerVersion', reducerVersion);
    });
};

export default {updateReducers};