import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import Firebase, {FbConfig, FbReduxConfig} from '../firebase';
import RehydrationServices from '../services/RehydrationServices';
import ReduxPersist from '../config/ReduxPersistConfig';

const {reactReduxFirebase} = Firebase;

const createFirebaseStore = compose(
    reactReduxFirebase(
        FbConfig,
        FbReduxConfig
    )
)(createStore);

export default (rootReducer, rootSaga, history) => {
    /* ------------- Redux Configuration ------------- */
    
    const middleware = [];
    const enhancers = [];
    
    /* ------------- React Router Redux Middleware ------------- */
    
    middleware.push(routerMiddleware(history));
    
    /* ------------- Saga Middleware ------------- */
    
    const sagaMiddleware = createSagaMiddleware();
    middleware.push(sagaMiddleware);
    
    /* ------------- Assemble Middleware ------------- */
    
    enhancers.push(applyMiddleware(...middleware));
    
    /* ------------- AutoRehydrate Enhancer ------------- */
    
    // add the autoRehydrate enhancer
    if (ReduxPersist.active) {
        enhancers.push(autoRehydrate())
    }

    
    const store = createFirebaseStore(rootReducer, compose(...enhancers));
    
    // configure persistStore and check reducer version number
    if (ReduxPersist.active) {
        RehydrationServices.updateReducers(store);
    }
    
    // kick off root sagas
    sagaMiddleware.run(rootSaga);
    
    return store
};