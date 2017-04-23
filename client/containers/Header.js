import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { replace, push } from 'react-router-redux';

import { AppBar, Avatar, Chip, FlatButton } from 'material-ui';
import { ActionPermIdentity } from 'material-ui/svg-icons';
import s from './Header.css';

import AuthActions, { isLoggedIn, getUser } from '../redux/Auth';

const pushHome = () => push('/');
const handleLogout = (logoutFn) => () => {
  logoutFn();
  replace('/');
};

const Header = ({ loggedIn, user, login, logout }) => (
  <div className={s.container}>
    {loggedIn ? <AuthHeader user={user} logout={logout} /> : <PlainHeader login={login} />}
  </div>
);

const AuthHeader = ({ user: { photoURL, displayName }, logout }) => (
  <AppBar
    zDepth={2}
    showMenuIconButton={false}
    title="BRICK"
    onTitleTouchTap={pushHome}
    iconStyleRight={{
      display: 'flex',
      marginTop: 0,
      alignItems: 'center',
    }}
    iconElementRight={
      <Chip className={s.authChip} onRequestDelete={handleLogout(logout)}>
        { !!photoURL && photoURL !== '' ? <Avatar src={photoURL} size={32}/> : <Avatar size={32}>{displayName[0]}</Avatar>}
        { displayName }
      </Chip>
    }
  />
);

const PlainHeader = ({ login }) => (
  <AppBar
    zDepth={2}
    showMenuIconButton={false}
    title="BRICK"
    onTitleTouchTap={pushHome}
    iconElementRight={
      <FlatButton
        label="Google Sign In"
        labelPosition="after"
        icon={<ActionPermIdentity />}
        onTouchTap={login}
        primary
      />
    }
  />
);


Header.propTypes = {
  loggedIn: PropTypes.bool,
  login: PropTypes.func,
  logout: PropTypes.func,
  user: PropTypes.object,
};

AuthHeader.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

PlainHeader.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loggedIn: isLoggedIn(state),
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(AuthActions.loginRequest()),
  logout: () => dispatch(AuthActions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);