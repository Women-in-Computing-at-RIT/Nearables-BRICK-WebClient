import React from 'react';
import { connect } from 'react-redux';

import { AppBar, FlatButton, Chip, Avatar} from 'material-ui';

class Landing extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.loggingIn = false;
  }
  
  handleLogin = () => {
    this.props.firebase.login({
      provider: 'google',
      type: 'redirect',
    });
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
    const rest = this.renderForAuth(null);
    
    return (
      <div>
        <AppBar showMenuIconButton={false} title="BRICK Manager" zDepth={2}/>
        { rest }
      </div>
    );
  }
}

const mapStateToProps = ({}) => ({

});

export default connect(mapStateToProps)(Landing);