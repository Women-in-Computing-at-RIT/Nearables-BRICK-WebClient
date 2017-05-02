import React from 'react';
import PropTypes from 'prop-types';

import invariant from 'invariant';

import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Paper, FloatingActionButton } from 'material-ui';
import { NavigationArrowBack } from 'material-ui/svg-icons';

import { Event, Broadcast } from '../../lib/objects';
import { QRCodes } from '../../lib/qrcode';

import { getCurrentEvent } from '../../redux/Event';
import BroadcastActions, { getBroadcasts, getLastBroadcast } from '../../redux/Broadcast';
import { routerPop as pop } from '../../redux/extensions';

import QRCode from 'qrcode.react';
import BroadcastList from '../components/BroadcastList';
import BroadcastInput from '../components/BroadcastInput';
import FluidContainer from '../FluidContainer';

import s from './EventPage.css';

class EventPage extends React.Component {
  
  static propTypes = {
    event: PropTypes.instanceOf(Event),
    lastBroadcast: PropTypes.instanceOf(Broadcast),
    allBroadcasts: PropTypes.arrayOf(PropTypes.instanceOf(Broadcast)),
    returnToUserPage: PropTypes.func,
    sendBroadcast: PropTypes.func,
  }
  
  handleBroadcast = (broadcast) => {
    invariant(broadcast != null, 'Broadcast must not be null.');
    invariant(broadcast.id != null, 'Broadcast must have a set id to be sent to the database.');
    
    this.props.sendBroadcast(broadcast);
  };
  
  render() {
    const { event, allBroadcasts, lastBroadcast, returnToUserPage } = this.props;
    
    if (!event)
      return <Redirect to="/u"/>;
    
    const startTimeFull = event.startTime.format('MMM Do, YYYY h:mm A');
    const endTimeFull = event.endTime.format('MMM Do, YYYY h:mm A');
    
    const timeRange = `${startTimeFull} - ${endTimeFull}`;
    
    return (
      <FluidContainer className={s.container}>
        <Paper className={s.header}>
          <header>{event.name}</header>
          <h5>{timeRange}</h5>
          <h6>At {event.location.label}, Approx. ({Math.round(event.location.location.lat)}, {Math.round(event.location.location.lng)})</h6>
          <FloatingActionButton className={s.backButton} onTouchTap={returnToUserPage}>
            <NavigationArrowBack/>
          </FloatingActionButton>
        </Paper>
        
        <Paper className={s.qrcode}>
          <Link to={`/qrcode/${event.id}`}>
            <div className={s.qrcodeShrinkwrap}>
              <QRCode className={s.qrcode} value={QRCodes.event.create(event.id)} level="M" size={128} fgColor="#3e2723" bgColor="#fb8c00"/>
            </div>
          </Link>
        </Paper>
        <Paper className={s.broadcastContainer}>
          <BroadcastList className={s.history} broadcasts={allBroadcasts} last={lastBroadcast} />
          <BroadcastInput eventId={event.id} onSubmit={this.handleBroadcast} />
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
  sendBroadcast: (b) => dispatch(BroadcastActions.sendBroadcast(b)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventPage);
