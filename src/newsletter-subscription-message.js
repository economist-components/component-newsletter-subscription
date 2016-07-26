import React from 'react';
import classNames from 'classnames';

export default function NewsletterSubscriptionMessage(props) {
  return (
    <p className={classNames(props.className, props.classNameModifiers)}>
      {props.children}
    </p>
  );
}

if (process.env.NODE_ENV !== 'production') {
  NewsletterSubscriptionMessage.propTypes = {
    className: React.PropTypes.string,
    classNameModifiers: React.PropTypes.string,
    children: React.PropTypes.string,
  };
}
