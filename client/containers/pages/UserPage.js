import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getUser } from '../../redux/Auth';
import EventActions, { getAvailableEvents, getCurrentEvent } from '../../redux/Event';

import EventList from '../components/EventList';

import s from './UserPage.css';

class UserPage extends React.Component {
  
  static propTypes = {
    user: PropTypes.object,
    currentEvent: PropTypes.object,
    events: PropTypes.arrayOf(PropTypes.object),
    selectEvent: PropTypes.func,
  }
  
  state = {
    showAdd: false,
    showEdit: false,
  }
  
  handleSelection = (event) => {
    this.props.selectEvent(event);
  };
  
  toggleShowAdd = (value) => this.setState({ showAdd: value == null ? !this.state.showAdd : !!value });
  toggleShowEdit = (value) => this.setState({ showEdit: value == null ? !this.state.showEdit : !!value});
  
  handleAdd = (event) => {
    this.toggleShowAdd(true);
    this.handleSelection(event);
  }
  
  handleEdit = (event) => {
    this.toggleShowEdit(true);
    this.handleSelection(event);
  }
  
  render() {
    const { events, currentEvent } = this.props;
    
    return (
      <section className={s.container}>
        <div>
          {/*<EventList events={events} currentEvent={currentEvent} onAdd={this.handleAdd} onEdit={this.handleEdit}/>*/}
        </div>
      </section>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);