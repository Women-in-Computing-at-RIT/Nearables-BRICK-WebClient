import React from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import App from './App';
import makeRoutes from '../routes';

import DevTools from './components/DevTools';

class Root extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <div>
          <App>
            <ConnectedRouter history={history} >
              <div children={makeRoutes()} />
            </ConnectedRouter>
          </App>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;