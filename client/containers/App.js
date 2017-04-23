import './App.css';
import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './Header';

const App = ({children}) => (
  <MuiThemeProvider>
    <div>
      <Header />
      {children}
    </div>
  </MuiThemeProvider>
);

export default App;