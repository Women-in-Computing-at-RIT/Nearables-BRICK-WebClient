import React from 'react';
import PropTypes from 'prop-types';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = ({children}) => (
  <MuiThemeProvider>
      {children}
  </MuiThemeProvider>
);

export default App;