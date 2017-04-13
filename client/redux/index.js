import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import configureStore from './createStore';
import rootSaga from '../sagas';

import Firebase from '../firebase';

export default (history) => {
    // Reducers!, Assemble!
    const rootReducer = combineReducers({
        
        
        // React Router Redux
        router: routerReducer,
        firebase: Firebase.firebaseStateReducer
    });
    
    return configureStore(rootReducer, rootSaga, history);
}