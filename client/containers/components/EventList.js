import React from 'react';
import PropTypes from 'prop-types';

import { FloatingActionButton, Toolbar,  } from 'material-ui';
import { ContentAdd, ContentClear } from 'material-ui/svg-icons';

class EventList extends React.Component {
  
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
  };
  
  handleAddTap = (event) => () => {
    const { onAdd } = this.props;
    onAdd(event);
  };
  
  handleEditTap = (event) => () => {
    const { onEdit } = this.props;
    
    onEdit(event);
  };
  
  generateActionButtons = (event) => (
    <div>
      <FloatingActionButton mini={true} onTouchTap={this.handleEditTap(event)}>
        <ContentAdd/>
      </FloatingActionButton>
      <FloatingActionButton mini={true} onTouchTap={this.handleAddTap(event)} secondary>
        <ContentClear/>
      </FloatingActionButton>
    </div>
  );
  
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default EventList;

