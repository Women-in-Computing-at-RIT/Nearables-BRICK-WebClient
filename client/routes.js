import React from 'react';
import { Route } from 'react-router';

import Landing from './containers/Landing';

export const makeRoutes = () => (
    <Route exact path='/' component={Landing}/>
);

export default makeRoutes;