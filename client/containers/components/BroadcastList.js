import React from 'react';
import PropTypes from 'prop-types';

import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from 'material-ui';

import { Broadcast } from '../../lib/objects';
import FluidContainer from '../FluidContainer';

class BroadcastList extends React.Component {
  
  static propTypes = {
    broadasts: PropTypes.arrayOf(PropTypes.instanceOf(Broadcast)).isRequired,
  }
  
  render() {
    return <div/>;
  }
}

export default BroadcastList;
