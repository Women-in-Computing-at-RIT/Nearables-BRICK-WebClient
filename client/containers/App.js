import './App.css';
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Halogen from 'halogen';

import Header from './Header';
import { isFullyLoaded } from '../redux/Startup';
import AppMuiTheme from './AppMuiTheme';

import s from './App.css';

//noinspection RequiredAttributes
const App = ({children, isLoaded}) =>
  isLoaded ?
    (
      <MuiThemeProvider muiTheme={AppMuiTheme} >
        <div style={{
          minHeight: '100%',
          width: '100%',
        }}>
          <Header />
          {children}
        </div>
      </MuiThemeProvider>
    ) :
    (
      <section className={s.loader}>
        <div className={s.loaderContent}>
          <header className={s.loaderText}>Please Wait...</header>
          <div className={s.loaderGrid}>
            <div className={s.loaderRow}>
              <Halogen.GridLoader color="#555" size="40px" margin="16px" />
              <Halogen.GridLoader color="#555" size="40px" margin="16px" />
            </div>
            <div className={s.loaderRow}>
              <Halogen.GridLoader color="#555" size="40px" margin="16px" />
              <Halogen.GridLoader color="#555" size="40px" margin="16px" />
            </div>
          </div>
        </div>
      </section>
    );

App.propTypes = {
  children: PropTypes.element,
  isLoaded: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isLoaded: isFullyLoaded(state),
});

export default connect(mapStateToProps)(App);
