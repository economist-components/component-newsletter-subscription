import React from 'react';

export default function Message(props) {
  return (
    <p className={props.className}>
      {props.children}
    </p>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Message.propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.string,
  };
}
