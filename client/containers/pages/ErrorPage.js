import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';

import { Paper, RaisedButton } from 'material-ui';
import { NavigationArrowBack } from 'material-ui/svg-icons';

import FluidContainer from '../FluidContainer';
import statusMessage from '../../lib/StatusCodeErrors';

import s from './styles/ErrorPage.styles';

const ErrorPageComponent = ({ location, history, code, message, randomMessage }) => {
  const errorDetails = statusMessage(code, randomMessage);
  let developerMessage = message == null ? errorDetails.message : message;
  developerMessage = developerMessage.replace(':location:', location.pathname);
  const locationMessage = errorDetails.formatForLocation(location.pathname);
  
  return (
    <FluidContainer style={s.container} ContainerElement={Paper}>
      <Helmet>
        <meta type="description" content={locationMessage}/>
        <title>{`${code} - ${errorDetails.name}`}</title>
      </Helmet>
      <div style={s.header}>
        <header style={s.errorTitle}>
          <div style={s.errorCode}>{code}.</div>
          <div style={s.errorName}>{errorDetails.name}</div>
          <div style={s.errorLocation}>{locationMessage}</div>
        </header>
        <section style={s.description}>
          {developerMessage}
        </section>
      </div>
      <div style={s.buttonContainer}>
        <RaisedButton
          labelStyle={s.buttonLabel}
          label="Go Back From Whence You Came"
          icon={<NavigationArrowBack/>}
          onTouchTap={history.goBack}
          fullWidth
          primary
        />
      </div>
    </FluidContainer>
  );
};

ErrorPageComponent.propTypes = {
  code: PropTypes.number.isRequired,
  randomMessage: PropTypes.bool,
  message: PropTypes.string,
  goBack: PropTypes.func,
};

ErrorPageComponent.defaultProps = {
  randomMessage: false,
};

const ErrorPage = withRouter(ErrorPageComponent);
export default ErrorPage;

// Derived Error Pages

export const Error404 = (props) => <ErrorPage code={404} />;
export const NotFoundError = Error404;

export const Error403 = (props) => <ErrorPage code={403} />;
export const ForbiddenError = Error403;

// Environment Dependent 423 Page, in production the page is a 404 but a console error is emitted

if (process.env.NODE_ENV === 'development')
  module.exports.Error423 = module.exports.InDevPage = (props) => <ErrorPage code={423} />;
else {
  module.exports.Error423 = module.exports.InDevPage = () => {
    // eslint-disable-next-line no-console
    console.error('Should not be using 423 Page in production.');
    return <Error404 />;
  };
}
