import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import moment from 'moment';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import { Paper, CircularProgress, Dialog, SelectField, MenuItem, RaisedButton } from 'material-ui';

import FluidContainer from '../FluidContainer';

import { isLoggedIn } from '../../redux/Auth';
import { getAvailableEvents } from '../../redux/Event';
import { RefEvents, event } from '../../lib/refs';
import { QRCodes } from '../../lib/qrcode';
import firebase from '../../firebase';

import s from './QRCodePage.css';

class QRCodePage extends React.Component {
  
  static propTypes = {
    loggedIn: PropTypes.bool,
    events: PropTypes.arrayOf(PropTypes.object),
    match: PropTypes.object,
    dispatch: PropTypes.func,
  }
  
  state = {
    loading: false,
    eventId: null,
    event: null,
    error: null,
    
    promptValue: null,
  }
  
  loadEventData = (id) => {
    const putEvent = (event) => this.setState({ loading: false, event });
    
    firebase.database().ref(event({ id }))
      .once(RefEvents.VALUE)
      .then((snapshot) => Promise.resolve(snapshot.val()))
      .then((event) => putEvent(event));
    
    this.setState({ loading: true });
  };
  
  componentWillMount() {
    const { match } = this.props;
    const eventId = match.params.id;
    
    if (eventId != null) {
      this.setState({ eventId });
      this.loadEventData(eventId);
    }
  }
  
  renderPrompt = () => {
    const { events: evts, dispatch } = this.props;
    const { promptValue } = this.state;
    
    const events = evts.sort((a, b) => -1*a.startTime + b.startTime);
    
    const actions = [
      <RaisedButton label="Select" onTouchTap={() => promptValue ? dispatch(replace(`/qrcode/${promptValue.id}`)) : null} primary />,
    ];
    
    return (
      <Dialog
        actions={actions}
        open={true}
        modal={true}
        title="Event Selection"
      >
        <SelectField
          floatingLabelText="Select your event"
          value={promptValue}
          onChange={(event, index, value) => this.setState({ promptValue: value })}
        >
          {
            events.map((event, idx) =>
              <MenuItem
                key={idx}
                value={event}
                primaryText={`${moment(event.startTime).format('MM/YYYY')} - ${event.name}`}
              />
            )
          }
        </SelectField>
      </Dialog>
    );
  };
  
  renderLoading = () => (
    <CircularProgress size={80} thickness={5} />
  );
  
  renderNoEvent = () => (
    <section>No Event to Load</section>
  );
  
  renderEvent = (event) => (
    <section className={s.container}>
      <Paper className={s.qrContainer} zDepth={3}>
        <QRCode value={QRCodes.event.create(event.id)} level="M" size={354} fgColor="#3e2723" bgColor="#fb8c00"/>
      </Paper>
      <div className={s.detailsContainer}>
        <Paper className={s.details}>
          <header>{event.name}</header>
          <hr />
          <section>
            <div>{moment(event.startTime).format('MMMM Do YYYY')}</div>
            <div>Starting at {moment(event.startTime).format('HH:mm A')}</div>
            <div>Goes for {moment.duration(event.duration).humanize(false)}</div>
          </section>
        </Paper>
      </div>
    </section>
  );
  
  render() {
    const { eventId, event, loading, error } = this.state;
    const { loggedIn } = this.props;
    
    if (error)
      throw error;
    
    let content;
    
    if(!eventId)
      if (loggedIn)
        content = this.renderPrompt();
      else
        content = this.renderNoEvent();
    else if (loading)
      content = this.renderLoading();
    else if(!event)
      content = this.renderNoEvent();
    else
      content = this.renderEvent(event);
    
    return (
      <FluidContainer ContainerElement={Paper}>
        { content }
      </FluidContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: isLoggedIn(state),
  events: getAvailableEvents(state),
});

export default withRouter(connect(mapStateToProps)(QRCodePage));

