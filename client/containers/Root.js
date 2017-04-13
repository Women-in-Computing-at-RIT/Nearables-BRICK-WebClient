import React from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

const Root = ({ store, history }) => (
  <Provider store={store}>
      <ConnectedRouter history={history} >
          <div>
          
          </div>
      </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default Root;