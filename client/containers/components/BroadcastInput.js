import React from 'react';
import PropTypes from 'prop-types';

import { Paper, TextField, Dialog, FloatingActionButton, RaisedButton } from 'material-ui';
import { ContentSend } from 'material-ui/svg-icons';

import { Broadcast } from '../../lib/objects';
import FluidContainer from '../FluidContainer';

import s from './BroadcastInput.css';

class BroadcastInput extends React.Component {
  
  static propTypes = {
    eventId: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }
  
  state = {
    value: '',
    confirm: false,
  }
  
  handleSubmit = () => {
    const { value } = this.state;
    const { eventId, onSubmit } = this.props;
    
    const broadcast = new Broadcast({
      eventId,
      author: 'BRICK Team',
      value,
    });
    
    onSubmit(broadcast);
  };
  
  handleConfirm = () => {
    this.setState({ confirm: false });
    this.handleSubmit();
  };
  
  toggleConfirmation = () => this.setState({ confirm: !this.state.confirm });
  
  render() {
    const { value, confirm } = this.state;
    
    const actions = [
      <RaisedButton label="Confirm" onTouchTap={this.handleConfirm} primary />,
      <RaisedButton label="Cancel" onTouchTap={this.toggleConfirmation} secondary />,
    ];
    
    return (
      <FluidContainer className={s.container}>
        <Paper zDepth={2}>
          <TextField
            floatingLabelText="Broadcast Content"
            hintText="What do you want to tell the participants?"
            value={value}
            disabled={confirm}
            underlineShow={false}
            rows={3}
            rowsMax={3}
            
            onChange={(evt, value) => this.setState({ value })}
            
            floatingLabelFixed
            multiLine
          />
        </Paper>
        <div>
          <FloatingActionButton
            disabled={confirm || value.length <= 0}
            onTouchTap={this.toggleConfirmation}
            zDepth={2}
          >
            <ContentSend/>
          </FloatingActionButton>
        </div>
        <Dialog
          open={confirm}
          onRequestClose={this.toggleConfirmation}
          title="Broadcast Confirmation"
          actions={actions}
        >
          <div>
            Are you sure you want to send the following broadcast to all users?
          </div>
          <section>
            {value}
          </section>
        </Dialog>
      </FluidContainer>
    );
  }
}

export default BroadcastInput;
