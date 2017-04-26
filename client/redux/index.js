import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import configureStore from './createStore';
import rootSaga from '../sagas';

export default (history) => {
    // Reducers!, Assemble!
  const rootReducer = combineReducers({
    startup: require('./Startup').reducer,
    auth: require('./Auth').reducer,
    events: require('./Event').reducer,
    
    // Redux Form Reducer
    form: formReducer,
    // React Router Redux
    router: routerReducer,
  });
    
  return configureStore(rootReducer, rootSaga, history);
};