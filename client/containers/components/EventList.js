import React from 'react';
import PropTypes from 'prop-types';

class EventList extends React.Component {
  
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelect: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    
    this.state = {
      showEdit: false,
      showAdd: false,
      selected: null,
    }
  }
  
  render() {
  
  }
}