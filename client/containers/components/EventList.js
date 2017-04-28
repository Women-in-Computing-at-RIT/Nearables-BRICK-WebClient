import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import moment from 'moment';

import { Paper, FloatingActionButton, Toolbar, ToolbarGroup,
  Toggle, ToolbarTitle, SelectField, MenuItem, Dialog, RaisedButton,
  Table, TableHeader, TableBody, TableHeaderColumn, TableRow } from 'material-ui';
import { ContentAdd, ContentCreate, ContentClear, ActionVisibility } from 'material-ui/svg-icons';

import { invertComparator } from '../../lib/BrickUtils';
import EventItem from './EventListItem';

import s from './EventList.css';

const compareTimes = (a, b) => {
  const momentA = moment(a);
  const momentB = moment(b);
  
  if(momentA.isBefore(momentB))
    return -1;
  else if(momentA.isAfter(momentB))
    return 1;
  else
    return 0;
};

const compareDurations = (a, b) => {
  const durationA = moment.duration(a);
  const durationB = moment.duration(b);
  
  return durationA.asMilliseconds() - durationB.asMilliseconds();
};

const Sorters = {
  ['By Start Date']: (a, b) => compareTimes(a.startTime, b.startTime),
  ['By End Date']: (a, b) => compareTimes(a.endTime, b.endTime),
  ['By Duration']: (a, b) => compareDurations(a.duration, b.duration),
};

class EventList extends React.Component {
  
  static propTypes = {
    currentEvent: PropTypes.object,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelect: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
  };
  
  constructor(props) {
    super(props);
    
    this.state = {
      currentSort: Object.keys(Sorters)[0],
      sortInverted: false,
      confirmDelete: null,
    };
  }
  
  handleViewTap = (event) => () => {
    const { onSelect } = this.props;
    onSelect(event);
  };
  
  handleDeleteChoice = (event, confirmed) => () => {
    this.setState({ confirmDelete: null });
    
    if (confirmed)
      this.props.onDelete(event);
  };
  
  handleDeleteTap = (event) => () => {
    this.setState({ confirmDelete: event });
  };
  
  handleAddTap = () => {
    const { onAdd } = this.props;
    onAdd();
  };
  
  handleEditTap = (event) => () => {
    const { onEdit } = this.props;
    onEdit(event);
  };
  
  handleSortOnChange = (event, index, value) => {
    const { currentSort } = this.state;
    const name = value;
  
    if (name === currentSort)
      return;
  
    invariant(name in Sorters, `'${name}' is not a possible sort option.`);
  
    this.setState({
      currentSort: name,
      sortInverted: false,
    });
  }
  
  handleInvertSort = () => this.setState({ sortInverted: !this.state.sortInverted });
  
  generateActionButtons = (event) => (
    <div>
      <FloatingActionButton mini={true} onTouchTap={this.handleViewTap(event)}>
        <ActionVisibility/>
      </FloatingActionButton>
      <FloatingActionButton mini={true} onTouchTap={this.handleEditTap(event)}>
        <ContentCreate/>
      </FloatingActionButton>
      <FloatingActionButton mini={true} onTouchTap={this.handleDeleteTap(event)} secondary>
        <ContentClear/>
      </FloatingActionButton>
    </div>
  );
  
  getSortedEvents = () => {
    const { events } = this.props;
    const { currentSort, sortInverted } = this.state;
    
    const eventsCpy = [...events];
    const comparator = sortInverted ? invertComparator(Sorters[currentSort]) : Sorters[currentSort];
    
    return eventsCpy.sort(comparator);
  };
  
  getDeletePrompt = () => {
    const { confirmDelete } = this.state;
    
    const actions = [
      <RaisedButton
        label="Confirm"
        onTouchTap={this.handleDeleteChoice(confirmDelete, true)}
        primary
      />,
      <RaisedButton
        label="No Thanks"
        onTouchTap={this.handleDeleteChoice(confirmDelete, false)}
        secondary
      />,
    ];
    
    return (
      <Dialog
        title={`Deleting '${event ? event.name : ''}'`}
        open={!!confirmDelete}
        actions={actions}
        onRequestClose={this.handleDeleteChoice(confirmDelete, false)}
      >
        Are you sure you want to delete this event?
      </Dialog>
    );
  }
  
  render() {
    const events = this.getSortedEvents();
    
    const menuItems = Object.keys(Sorters).map((key, i) =>
      <MenuItem key={i} value={key} primaryText={key}/>
    );
    
    return (
      <Paper className={s.container}>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="Sort Order" style={{overflow: null}}/>
            <SelectField value={this.state.currentSort}
                         onChange={this.handleSortOnChange}
            >
              {menuItems}
            </SelectField>
            <Toggle style={{marginLeft: '20px', width: 'initial'}}
                    labelStyle={{width: null}}
                    label="Reverse Order:"
                    labelPosition="left"
                    toggled={this.state.sortInverted}
                    onToggle={this.handleInvertSort}/>
            <RaisedButton
              label="Add Event"
              icon={<ContentAdd />}
              onTouchTap={this.handleAddTap}
              primary
            />
          </ToolbarGroup>
        </Toolbar>
        <Table
          height="100%"
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
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Start</TableHeaderColumn>
              <TableHeaderColumn>End</TableHeaderColumn>
              <TableHeaderColumn>Duration</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
            stripedRows={true}
          >
            {
              events.map((event, idx) => (
                <EventItem key={idx} event={event} selected={this.props.currentEvent ? this.props.currentEvent.id === event.id : false}>
                  { this.generateActionButtons(event) }
                </EventItem>
              ))
            }
          </TableBody>
        </Table>
        { this.getDeletePrompt() }
      </Paper>
    );
  }
}

export default EventList;

