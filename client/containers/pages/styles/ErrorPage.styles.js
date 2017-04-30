import { grey100, grey200, grey500 } from 'material-ui/styles/colors';

const container = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const header = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '400px',
  height: '80%',
  backgroundColor: grey200,
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'center',
  padding: '5em 0 0 0',
};

const errorTitle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50%',
  height: '70%',
  backgroundColor: grey100,
  
  fontWeight: 'bold',
  fontSize: '5rem',
};

const errorCode = {
  lineHeight: 'normal',
};

const errorName = {
  fontSize: '3rem',
  fontWeight: 'lighter',
  lineHeight: 'normal',
  color: grey500,
};

const errorLocation = {
  fontSize: '1.02rem',
  fontWeight: 'lighter',
  lineHeight: '2rem',
};

const buttonContainer = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50%',
};

const description = {
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  height: '1.5rem',
  width: '45%',
  fontWeight: 'bold',
  margin: '2em 0',
};

export default {
  container,
  header,
  errorTitle,
  errorCode,
  errorName,
  errorLocation,
  description,
  buttonContainer,
};
