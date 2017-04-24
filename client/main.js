/* eslint-disable no-unused-vars */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import createHistory from 'history/createBrowserHistory';
import FastClick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Root from './containers/Root';
import createStore from './redux';
import { firebaseSubscriptions } from './subscriptions';

const history = createHistory();
const store = createStore(history);

// Register Redux subscriptions that firebase can/needs to use.
firebaseSubscriptions(store.dispatch);

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const render = (RootComponent) =>
    ReactDOM.render(
        <AppContainer>
            <RootComponent store={store} history={history} />
        </AppContainer>,
        document.getElementById('hey-you-react-mount-here')
    );

render(Root);
if(module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NewRoot = require('./containers/Root').default;
    render(NewRoot);
  });
}
