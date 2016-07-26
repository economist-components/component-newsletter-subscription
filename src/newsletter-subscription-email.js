import React from 'react';
import Validation from 'react-validation';

export default function NewsletterSubscriptionEmail(props) {
  return (
    <Validation.Input
      className={props.className}
      name="email"
      type="email"
      invalidClassName={`${ props.className }__email--error`}
      blocking="input"
      placeholder={props.placeholder}
      validations={[
        {
          rule: 'isRequired',
          errorMessage: 'E-mail is mandatory',
        },
        {
          rule: 'isEmail',
          errorMessage: 'E-mail not valid',
        },
      ]}
    />
  );
}

if (process.env.NODE_ENV !== 'production') {
  NewsletterSubscriptionEmail.propTypes = {
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    children: React.PropTypes.node,
  };
}
