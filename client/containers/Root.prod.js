import React from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import App from './App';
import makeRoutes from '../routes';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <div style={{
      height: 'inherit',
      width: 'inherit',
    }}>
      <App>
        <ConnectedRouter history={history} >
          <div style={{
            flex: 1,
            width: 'inherit',
          }} children={makeRoutes()} />
        </ConnectedRouter>
      </App>
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
