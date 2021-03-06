import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { AppBar, Avatar, Chip, FlatButton, RaisedButton, Dialog } from 'material-ui';
import { ActionPermIdentity } from 'material-ui/svg-icons';
import s from './Header.css';

import AuthActions, { isLoggedIn, getUser } from '../redux/Auth';

/*
  General Header, renders the Authenticated Header or Plain Header (Not Authenticated) depending
  on the current Auth state given by Redux.
 */
const Header = ({ loggedIn, user, login, logout, goHome }) => (
  <div className={s.container}>
    {loggedIn ? <AuthHeader user={user} logout={logout} goHome={goHome}/> : <PlainHeader login={login} goHome={goHome} />}
  </div>
);

/*
  Authenticated Header
 */
class AuthHeader extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      logoutPrompt: false,
    };
    
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogoutRequest = this.handleLogoutRequest.bind(this);
  }
  
  /**
   * Calls the logout function that dispatches a LOGOUT redux action and redirects to the index route. The state is
   * also changed so as to dismiss the prompt.
   */
  handleLogout = () => {
    const { logout } = this.props;
    logout();
    
    this.setState({ logoutPrompt: false });
  }
  
  /**
   * Toggle Logout Prompt State (Visible <-> Not Visible)
   */
  handleLogoutRequest = () => this.setState({ logoutPrompt: !this.state.logoutPrompt });
  
  render() {
    const { user, goHome } = this.props;
    const { logoutPrompt } = this.state;
    const { displayName, photoURL } = user;
    
    // Action Buttons for Logout Prompt
    const actions = [
      <RaisedButton label="Sign Out" onTouchTap={this.handleLogout} primary/>,
      <RaisedButton label="Cancel" onTouchTap={this.handleLogoutRequest} secondary/>
    ];
    
    return (
      <div>
        <AppBar
          zDepth={2}
          showMenuIconButton={false}
          title="BRICK"
          onTitleTouchTap={goHome}
          iconStyleRight={{
            display: 'flex',
            marginTop: 0,
            alignItems: 'center',
          }}
          iconElementRight={
            <Chip className={s.authChip} onRequestDelete={this.handleLogoutRequest}>
              { !!photoURL && photoURL !== '' ? <Avatar src={photoURL} size={32}/> : <Avatar size={32}>{displayName[0]}</Avatar>}
              { displayName }
            </Chip>
          }
        />
        <Dialog
          title="Confirm Sign Out"
          open={logoutPrompt}
          actions={actions}
          onRequestClose={this.handleLogoutRequest}
          modal
        >
          Do you wish to sign out now? You will be returned to the landing page.
        </Dialog>
      </div>
    );
  }
}

/*
  Stateless header. Does not need to prompt or anything, simply displays the header
  with a Sign In Button
 */
const PlainHeader = ({ login, goHome }) => (
  <AppBar
    zDepth={2}
    showMenuIconButton={false}
    title="BRICK"
    onTitleTouchTap={goHome}
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
  goHome: PropTypes.func,
  user: PropTypes.object,
};

AuthHeader.propTypes = {
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  goHome: PropTypes.func.isRequired,
};

PlainHeader.propTypes = {
  login: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loggedIn: isLoggedIn(state),
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(AuthActions.loginRequest()),
  logout: () => dispatch(AuthActions.logout()),
  goHome: () => dispatch(push('/')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);