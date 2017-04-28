import React from 'react';
import PropTypes from 'prop-types';

import { TableRow, TableRowColumn } from 'material-ui';
import { Event } from '../../lib/BrickObjects';

class EventListItem extends React.Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    children: PropTypes.node,
  };
  
  render() {
    const { event: rawEvent, selected, onSelected } = this.props;
    
    const event = new Event(rawEvent);
    
    const duration = event.duration;
    const startTime = event.startTime;
    const endTime = event.endTime;
    
    return (
      <TableRow key={event.id} selected={selected}>
        <TableRowColumn>{event.name}</TableRowColumn>
        <TableRowColumn>{startTime.format('MMM Do YYYY h:mm A')}</TableRowColumn>
        <TableRowColumn>{endTime.format('MMM YYYY Do h:mm A')}</TableRowColumn>
        <TableRowColumn>{duration.humanize(false)}</TableRowColumn>
        <TableRowColumn>
          {this.props.children}
        </TableRowColumn>
      </TableRow>
    );
  }
  
}

export default EventListItem;
