import React from 'react';
import PropTypes from 'prop-types';

import { RaisedButton } from 'material-ui';

export default class EventEditDialog extends React.Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props);
    
    this.state = {
      open: props.show,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    const { open } = this.state;
    const { show } = nextProps;
    
    if (!open)
      this.setState({ open: show });
  }
  
  render() {
    const { event, onClose } = this.props;
    const { open } = this.state;
    
    const actionElements = [
      <RaisedButton  />
    ];
    
    return (
      <div></div>
    );
  }
  
}

const EditForm = (props) => {

};