import React from 'react';
import { Route, Switch } from 'react-router';

import QRCodePage from './containers/pages/QRCodePage';
import Landing from './containers/pages/Landing';
import UserPage from './containers/pages/UserPage';
import EventPage from './containers/pages/EventPage';
import { NotFoundError, InDevPage } from './containers/pages/ErrorPage';
import { AuthRoute } from './lib/MoreRoutes';

export const makeRoutes = () => (
    <Switch>
      <Route exact path="/" component={Landing}/>
      
      <AuthRoute exact path="/qrcode" component={QRCodePage} />
      <Route exact path="/qrcode/:id" component={QRCodePage} />
      
      <AuthRoute exact path="/u" component={UserPage} />
      <AuthRoute exact path="/u/event" component={EventPage} />
      
      <Route component={NotFoundError} />
    </Switch>
);

export default makeRoutes;
