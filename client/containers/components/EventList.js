import React from 'react';
import PropTypes from 'prop-types';

class EventList extends React.Component {
  
  static propTypes = {
    currentEvent: PropTypes.object.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
  };
  
  render() {
  
  }
}

export default EventList;

