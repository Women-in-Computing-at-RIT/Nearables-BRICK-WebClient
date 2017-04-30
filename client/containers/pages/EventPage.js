import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentEvent } from '../../redux/Event';
import { routerPop as pop } from '../../redux/extensions';

class EventPage extends React.Component {
  
  propT
  
}

const mapStateToProps = (state) => ({
  event: getCurrentEvent(state),
});

const mapDispatchToProps = (dispatch) => ({
  returnToUserPage: () => dispatch(pop()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
