import './App.css';
import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const App = ({children}) => (
  <MuiThemeProvider>
    <div>
        {children}
    </div>
  </MuiThemeProvider>
);

export default App;