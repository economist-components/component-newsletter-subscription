import React from 'react';

export default function Submit(props) {
  return (
    <input
      type="submit"
      value={props.value}
      className={props.className}
      disabled={props.disable}
    />
  );
}

if (process.env.NODE_ENV !== 'production') {
  Submit.propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.string,
    disable: React.PropTypes.bool,
    value: React.PropTypes.string,
  };
}
