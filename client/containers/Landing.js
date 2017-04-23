import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppBar, FlatButton, Chip, Avatar} from 'material-ui';
import AuthActions, { isLoggedIn } from '../redux/Auth';

class Landing extends React.Component {
  
  static propTypes = {
    loggedIn: PropTypes.bool,
    login: PropTypes.func,
  }
  
  constructor(props) {
    super(props);
  }
  
  handleLogin = () => {
    this.props.login();
  };
  
  renderForAuth = (auth) => {
    if (!auth)
      return <FlatButton label="G+ Login" onTouchTap={this.handleLogin} primary />;
    else
      return [
        <Chip>{auth.email}</Chip>,
        <Chip><Avatar src={auth.photoURL} />{auth.displayName}</Chip>
      ];
  }
    
  render() {
    const { loggedIn } = this.props;
    console.log(loggedIn);
    const rest = this.renderForAuth(null);
    
    return (
      <div>
        { rest }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(AuthActions.loginRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);