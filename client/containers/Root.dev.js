import React from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import App from './App';
import makeRoutes from '../routes';

import DevTools from './components/DevTools';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history} >
      <div>
        <App>
          <div children={makeRoutes()} />
        </App>
        <DevTools/>
      </div>
    </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;