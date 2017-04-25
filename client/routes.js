import React from 'react';
import { Route, Switch } from 'react-router';

import Landing from './containers/pages/Landing';
import UserPage from './containers/pages/UserPage';

export const makeRoutes = () => (
    <Switch>
      <Route exact path='/' component={Landing}/>
      <Route path='/u' component={UserPage} />
    </Switch>
);

export default makeRoutes;