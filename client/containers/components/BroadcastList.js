import React from 'react';
import PropTypes from 'prop-types';

import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, Paper } from 'material-ui';

import { Broadcast } from '../../lib/objects';

import BroadcastListItem from './BroadcastListItem';

class BroadcastList extends React.Component {
  
  static propTypes = {
    broadcasts: PropTypes.arrayOf(PropTypes.instanceOf(Broadcast)).isRequired,
    last: PropTypes.instanceOf(Broadcast),
  }
  
  render() {
    const { /** @type [Broadcast] */ broadcasts, /** @type Broadcast */ last, ...rest } = this.props;
    
    return (
    <Paper {...rest}>
      <Table
        height="280px"
        fixedHeader={true}
        selectable={false}
        multiSelectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          enableSelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn style={{width: '10%'}}>Timestamp</TableHeaderColumn>
            <TableHeaderColumn style={{width: '10%'}}>Author</TableHeaderColumn>
            <TableHeaderColumn style={{width: '50%'}}>Content</TableHeaderColumn>
            <TableHeaderColumn style={{width: '20%'}}>Location</TableHeaderColumn>
            <TableHeaderColumn style={{width: '10%'}}>Expired?</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover={false}
          stripedRows={true}
        >
          {
            broadcasts.map((broadcast, idx) => (
              <BroadcastListItem key={idx} broadcast={broadcast} selected={last && broadcast.id === last.id}
                columnWidths={[10, 10, 50, 20, 10]}
              />
            ))
          }
        </TableBody>
      </Table>
    </Paper>);
  }
}

export default BroadcastList;
