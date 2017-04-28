import React from 'react';

import R from 'ramda';
import moment from 'moment';

import { TextField, DatePicker, TimePicker } from 'material-ui';
import { reduxForm, Field } from 'redux-form';

import { keyMirrorTransform, snakeToLowerCamel, Moments } from '../../lib/BrickUtils';
import Validation from './validations';

export const FormName = 'EventAddForm';

const Fields = keyMirrorTransform(snakeToLowerCamel)({
  NAME: null,
  START_DATE: null,
  START_TIME: null,
  END_DATE: null,
  END_TIME: null,
});

const validate = (values) => {
  const errors = {};
  
  R.forEachObjIndexed(Fields, (field) => {
    if (!values[field])
      errors[field] = 'This field is required.';
  });
  
  const { name, startTime, startDate, endTime, endDate } = values;
  
  if (name && (name.length < 5 || name.length > 80))
    errors[Fields.NAME] = `${Fields.NAME} must be between 5 and 80 characters`;
  
  if (startTime && endTime && startDate && endDate) {
    const startMoment = Moments.fromDateAndTime(startDate, startTime);
    const endMoment = Moments.fromDateAndTime(endDate, endTime);
    const now = moment().add(moment.duration(1, 'day'));
  
    if (startMoment.isSameOrBefore(now))
      errors[Fields.START_TIME] = errors[Fields.START_DATE] = 'Must be at least 1 day in the future';
  
    if (startMoment.isSameOrAfter(endMoment))
      errors[Fields.END_TIME] = errors[Fields.END_DATE] = 'Must be after start time and date';
  }
  
  return errors;
};

const renderTextField = ({ input, label, meta: { touched, error, submitting }, ...custom }) => {
  return (
  <TextField
    hintText={label}
    disabled={submitting}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />);
};

const temporalOnChange = (original) => (_, temporal) => original(temporal);

const renderDateField = ({ input, label, meta: { touched, error, submitting }, ...custom }) => {
  if(input.value)
    input.value = moment(input.value).toDate();
  else
    input.value = null;
  
  const originalOnChange = input.onChange;
  input.onChange = temporalOnChange(originalOnChange);
  
  return (
    <DatePicker
      hintText={label}
      minDate={moment().add(moment.duration(1, 'day')).toDate()}
      errorText={touched && error}
      disabled={submitting}
      {...input}
      {...custom}
    />
  );
};

const renderTimeField = ({ input, label, meta: { touched, error, submitting }, ...custom }) => {
  if(input.value)
    input.value = moment(input.value).toDate();
  else
    input.value = null;
  
  const originalOnChange = input.onChange;
  input.onChange = temporalOnChange(originalOnChange);
  
  return (
    <TimePicker
      hintText={label}
      errorText={touched && error}
      disabled={submitting}
      pedantic
      {...input}
      {...custom}
    />
  );
};

const EventEditForm = (props) => {
  const { handleSubmit } = props;
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field
          name={Fields.NAME}
          component={renderTextField}
          validate={[Validation.required, Validation.boundLength(5, 80)]}
          label="Event Name"
        />
      </div>
      <div>
        <Field
          name={Fields.START_DATE}
          component={renderDateField}
          label="Start Date"
          validate={Validation.required}
        />
      </div>
      <div>
        <Field
          name={Fields.START_TIME}
          component={renderTimeField}
          label="Start Time"
          validate={Validation.required}
        />
      </div>
      <div>
        <Field
          name={Fields.END_DATE}
          component={renderDateField}
          label="End Date"
          validate={Validation.required}
        />
      </div>
      <div>
        <Field
          name={Fields.END_TIME}
          component={renderTimeField}
          label="End Time"
          validate={Validation.required}
        />
      </div>
    </form>
  );
};

export default reduxForm({
  form: FormName,
  validate,
})(EventEditForm);
