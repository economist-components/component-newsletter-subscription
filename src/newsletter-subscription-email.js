import React from 'react';

export default function Email(props) {
  return (
    <input
      className={props.className}
      name="email"
      type="email"
      placeholder={props.placeholder}
      onKeyUp={props.handleValidation}
      onBlur={props.handleValidation}
    />
  );
}

if (process.env.NODE_ENV !== 'production') {
  Email.propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    handleValidation: React.PropTypes.func,
  };
}
