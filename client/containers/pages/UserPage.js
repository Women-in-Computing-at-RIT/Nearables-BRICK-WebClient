import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import moment from 'moment';

import { getUser } from '../../redux/Auth';
import EventActions, { getAvailableEvents, getCurrentEvent } from '../../redux/Event';

import FluidContainer from '../FluidContainer';
import EventList from '../components/EventList';
import EventAddDialog from '../components/EventAddDialog';

import { Event } from '../../lib/BrickObjects';
import { Moments } from '../../lib/BrickUtils';

class UserPage extends React.Component {
  
  static propTypes = {
    user: PropTypes.object,
    currentEvent: PropTypes.object,
    events: PropTypes.arrayOf(PropTypes.object),
    selectEvent: PropTypes.func,
    deleteEvent: PropTypes.func,
  }
  
  state = {
    showAdd: false,
    showEdit: false,
  }
  
  handleSelection = (event) => {
    this.props.selectEvent(event);
  };
  
  handleViewEvent = (event) => {
    const { dispatch } = this.props;
    
    this.handleSelection(event);
    dispatch(push('/u/event'));
  };
  
  toggleShowAdd = (value) => this.setState({ showAdd: value == null ? !this.state.showAdd : !!value });
  toggleShowEdit = (value) => this.setState({ showEdit: value == null ? !this.state.showEdit : !!value});
  
  handleAdd = () => {
    this.toggleShowAdd(true);
  }
  
  handleDelete = (event) => {
    this.props.deleteEvent(event);
  }
  
  handleEdit = (event) => {
    this.toggleShowEdit(true);
    this.handleSelection(event);
  }
  
  handleSubmitFromAddDialog = (values) => {
    const { name, startDate, startTime, endDate, endTime } = values;
    
    const startMoment = Moments.fromDateAndTime(startDate, startTime);
    const duration = Moments.timeBetweenDates(startDate, startTime, endDate, endTime);
    
    // TODO Add Event to Database and State
    
    this.setState({ showAdd: false });
  }
  
  handleCloseFromAddDialog = () => this.setState({ showAdd: false });
  
  render() {
    const { events, currentEvent } = this.props;
    const { showAdd } = this.state;
    
    // TODO Event Deletion
    return (
      <FluidContainer>
        <EventList
          events={events}
          currentEvent={currentEvent}
          onSelect={this.handleViewEvent}
          onAdd={this.handleAdd}
          onDelete={this.handleDelete}
          onEdit={this.handleEdit}/>
        <EventAddDialog
          show={showAdd}
          onSubmit={this.handleSubmitFromAddDialog}
          onClose={this.handleCloseFromAddDialog}/>
      </FluidContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  user: getUser(state),
  currentEvent: getCurrentEvent(state),
  events: getAvailableEvents(state),
});

const mapDispatchToProps = (dispatch) => ({
  selectEvent: (event) => dispatch(EventActions.setCurrentEvent(event)),
  deleteEvent: (event) => dispatch(EventActions.removeEvent(event)),
  dispatch: dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
