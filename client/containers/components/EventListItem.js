import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { TableRow, TableRowColumn } from 'material-ui';
import { Event } from '../../lib/BrickObjects';

class EventListItem extends React.Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    onSelected: PropTypes.func.isRequired,
    children: PropTypes.node,
  };
  
  render() {
    const { event: rawEvent, selected, onSelected } = this.props;
    
    const event = new Event(rawEvent);
    
    const duration = event.duration;
    const startTime = event.startTime;
    const endTime = event.endTime;
    
    return (
      <TableRow key={event.id} selected={selected} onRowClick={onSelected}>
        <TableRowColumn>{event.name}</TableRowColumn>
        <TableRowColumn>{startTime.calendar()}</TableRowColumn>
        <TableRowColumn>{endTime.format('h:mm A')}</TableRowColumn>
        <TableRowColumn>{duration.humanize(false)}</TableRowColumn>
        <TableRowColumn>
          {this.props.children}
        </TableRowColumn>
      </TableRow>
    );
  }
  
}