import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Paper } from 'material-ui';

import { Event, Broadcast } from '../../lib/objects';
import { QRCodes } from '../../lib/qrcode';

import { getCurrentEvent } from '../../redux/Event';
import { getBroadcasts, getLastBroadcast } from '../../redux/Broadcast';
import { routerPop as pop } from '../../redux/extensions';

import QRCode from 'qrcode.react';
import BroadcastInput from '../components/BroadcastInput';
import FluidContainer from '../FluidContainer';

import s from './EventPage.css';

class EventPage extends React.Component {
  
  static propTypes = {
    event: PropTypes.instanceOf(Event),
    lastBroadcast: PropTypes.instanceOf(Broadcast),
    allBroadcasts: PropTypes.arrayOf(PropTypes.instanceOf(Broadcast)),
  }
  
  handleBroadcast = (broadcast) => {
// eslint-disable-next-line no-console
    console.dir(broadcast);
  };
  
  render() {
    const { event, allBroadcasts, lastBroadcast } = this.props;
  
    if (!event)
      return <Redirect to="/u"/>;
    
    const startTimeFull = event.startTime.format('MMM Do, YYYY h:mm A');
    const endTimeFull = event.endTime.format('MMM Do, YYYY h:mm A');
    
    const timeRange = `${startTimeFull} - ${endTimeFull}`;
    
    /*
      Structure:
      Container
      | Event Header Container
      | | Event Header Content
      | | | Name
      | | | Period of Time
      | | | Location
      | Event Control UI
      | | Broadcast UI
      | | | ...
      | | Map & Task UI
      | | | Map UI
      | | | | ...
      | | | Task UI
      | | | | ...
     */
    
    // TODO Geolocation Page
    return (
      <FluidContainer className={s.container}>
        <Paper className={s.header}>
          <header>{event.name}</header>
          <h5>{timeRange}</h5>
          <h6>At {event.location.label}, Approx. ({Math.round(event.location.location.lat)}, {Math.round(event.location.location.lng)})</h6>
        </Paper>
        
        <Paper className={s.qrcode}>
          <Link to={`/qrcode/${event.id}`}>
            <div className={s.qrcodeShrinkwrap}>
              <QRCode className={s.qrcode} value={QRCodes.event(event.id)} level="M" size={128} fgColor="#3e2723" bgColor="#fb8c00"/>
            </div>
          </Link>
        </Paper>
        <Paper className={s.broadcastContainer}>
          <BroadcastInput eventId={event.id} onSubmit={this.handleBroadcast} />
        </Paper>
        <Paper className={s.taskContainer}>
        
        </Paper>
      </FluidContainer>
    );
  }
  
}

const mapStateToProps = (state) => ({
  event: getCurrentEvent(state),
  lastBroadcast: getLastBroadcast(state),
  allBroadcasts: getBroadcasts(state),
});

const mapDispatchToProps = (dispatch) => ({
  returnToUserPage: () => dispatch(pop()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
