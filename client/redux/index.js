import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import configureStore from './createStore';
import rootSaga from '../sagas';

export default (history) => {
    // Reducers!, Assemble!
    const rootReducer = combineReducers({
        
        
        // React Router Redux
        router: routerReducer
    });
    
    return configureStore(rootReducer, rootSaga, history);
}