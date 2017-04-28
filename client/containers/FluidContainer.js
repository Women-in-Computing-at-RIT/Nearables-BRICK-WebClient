import React from 'react';

export default (props) => {
  return (
    <div style={{
      ...props.style,
      minHeight: '100%',
      width: '100%',
    }} {...props}>
      {props.children}
    </div>
  );
};
