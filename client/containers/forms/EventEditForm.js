import React from 'react';
import { connect } from 'react-redux';

import R from 'ramda';

import { submit, reduxForm } from 'redux-form';
import { keyMirrorTransform, snakeToLowerCamel } from '../../lib/BrickUtils';

const Fields = keyMirrorTransform(snakeToLowerCamel)({
  NAME: null,
  START_TIME: null,
  END_TIME: null,
});

const validate = (values) => {
  const errors = {};
  
  R.forEachObjIndexed(Fields, (field) => {
    if (!values[field])
      errors[field] = 'This field is required.';
  });
  
  const { name, startTime, endTime } = values;
  
  if (R.length < 5 || R.length > 80)
    errors[Fields.NAME] = `${Fields.NAME} must be between 5 and 80 characters`;
  
};

const EventEditForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  
  return (
    <form onSubmit={handleSubmit}>
    
    </form>
  );
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default reduxForm({
  form: 'EventEditForm',
})(connect(mapStateToProps, mapDispatchToProps)(EventEditForm));