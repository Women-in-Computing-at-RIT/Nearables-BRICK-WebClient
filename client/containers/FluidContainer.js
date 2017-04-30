import React from 'react';
import PropTypes from 'prop-types';

const fluidStyle = {
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  maxWidth: '100%',
};

const containerStyle = {
  display: 'flex',
  flex: '1',
};

const defaultStyle = Object.assign({}, containerStyle, fluidStyle);

const FluidContainer = ({ ContainerElement, style, children, ...rest }) => {
  if (!style)
    style = {};
  
  if (ContainerElement) {
    return (
      <ContainerElement style={Object.assign(defaultStyle, style)} {...rest}>
        { children }
      </ContainerElement>
    );
  } else
    return (
      <div style={Object.assign(defaultStyle, style)} {...rest}>
        { children }
      </div>
    );
};

FluidContainer.propTypes = {
  ContainerElement: PropTypes.func,
};

export default FluidContainer;
