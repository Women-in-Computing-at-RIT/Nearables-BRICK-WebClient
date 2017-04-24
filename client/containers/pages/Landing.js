import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { isLoggedIn } from '../../redux/Auth';

class Landing extends React.Component {
  
  static propTypes = {
    loggedIn: PropTypes.bool,
  }
  
  constructor(props) {
    super(props);
  }
    
  render() {
    const { loggedIn } = this.props;
    
    if (!loggedIn) {
      return (
        <div>
        </div>
      );
    } else
      return <Redirect to="/u"/>
  }
}

const mapStateToProps = (state) => ({
  loggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(Landing);