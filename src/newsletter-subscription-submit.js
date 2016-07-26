import React from 'react';
import Validation from 'react-validation';

export default function NewsletterSubscriptionSubmit(props) {
  return (
    <Validation.Button
      blocking="button"
      value={props.value}
      className={props.className}
    >
      {props.children}
    </Validation.Button>
  );
}

if (process.env.NODE_ENV !== 'production') {
  NewsletterSubscriptionSubmit.propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    value: React.PropTypes.string,
  };
}
