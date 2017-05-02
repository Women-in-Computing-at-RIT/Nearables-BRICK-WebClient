import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { TableRow, TableRowColumn } from 'material-ui';
import { Broadcast } from '../../lib/objects';

class BroadcastListItem extends React.Component {
  
  static propTypes = {
    broadcast: PropTypes.instanceOf(Broadcast).isRequired,
    columnWidths: PropTypes.arrayOf(PropTypes.number),
    selected: PropTypes.bool,
    children: PropTypes.node,
  }
  
  static defaultProps = {
    select: false,
  }
  
  render() {
    const { broadcast, selected, columnWidths, ...rest } = this.props;
    
    const location = broadcast.spec;
    let locationString = 'N/A';
    let expiryString = 'No';
    
    if (broadcast.isLocationBased) {
      locationString = <a target="_blank" href={`https://www.google.com/maps/place/${location.lat},${location.lng}`}>
        ({Math.round(location.lat)}, {Math.round(location.lng)}, r = {location.rad * 1000} m)
      </a>;
      
      if (broadcast.isExpired)
        expiryString = 'Yes';
      
    }
    
    let styles;
    
    if (columnWidths) {
      styles = columnWidths.map((n) => ({width: `${n}%`}));
    }
    
    while(styles.length < 5)
      styles.push({});
    
    delete rest.select;
    
    return (
      <TableRow key={broadcast.id} selectable={false} selected={selected} displayBorder={false} {...rest}>
        <TableRowColumn style={styles[0]}>{moment(broadcast.timestamp).format('MMM DD hh:mm A')}</TableRowColumn>
        <TableRowColumn style={styles[1]}>{broadcast.author}</TableRowColumn>
        <TableRowColumn style={{...styles[2], whiteSpace: 'normal'}}>{broadcast.message}</TableRowColumn>
        <TableRowColumn style={styles[3]}>{locationString}</TableRowColumn>
        <TableRowColumn style={styles[4]}>{expiryString}</TableRowColumn>
      </TableRow>
    );
  }
  
}



export default BroadcastListItem;
