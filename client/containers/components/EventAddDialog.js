import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { reset, submit, isPristine, isSubmitting } from 'redux-form';
import { Dialog, RaisedButton } from 'material-ui';
import { ContentSend } from 'material-ui/svg-icons';

import EventAddForm, { FormName as AddFormName } from '../forms/EventAddForm';

class EventAddDialog extends React.Component {
  
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    
    submitForm: PropTypes.func,
    resetForm: PropTypes.func,
  }
  
  render() {
    const { onSubmit, onClose, submitForm, resetForm, pristine, submitting, show: open } = this.props;
    
    const actions = [
      <RaisedButton
        label="Submit"
        icon={<ContentSend/>}
        disabled={pristine || submitting}
        onTouchTap={submitForm}
        primary
      />,
      <RaisedButton
        label="Clear"
        disabled={pristine || submitting}
        onTouchTap={resetForm}
        secondary
      />,
    ];
    
    return (
      <Dialog
        open={open}
        actions={actions}
        title="Add Event"
        onRequestClose={onClose}
      >
        <EventAddForm onSubmit={onSubmit} />
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  pristine: isPristine(AddFormName)(state),
  submitting: isSubmitting(AddFormName)(state),
});

const mapDispatchToProps = (dispatch) => ({
  submitForm: () => dispatch(submit(AddFormName)),
  resetForm: () => dispatch(reset(AddFormName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventAddDialog);
