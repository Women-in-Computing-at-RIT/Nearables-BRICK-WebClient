import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import { isLoggedIn } from '../redux/Auth';
import { ForbiddenError } from '../containers/pages/ErrorPage';

const AuthRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route {...rest} render={props =>
    isLoggedIn ? <Component {...props}/> : <ForbiddenError />
  } />
);

module.exports.AuthRoute = connect((state) => ({ isLoggedIn: isLoggedIn(state) }))(AuthRoute);
