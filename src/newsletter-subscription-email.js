import React from 'react';
import isEmail from 'validator/lib/isEmail';
let timeout = null;
function checkEmail(email) {
  let message = '';
  let isValidEmail = true;
  if (!isEmail(email)) {
    message = 'Email not valid';
    isValidEmail = false;
  }

  return {
    message,
    isValidEmail,
  };
}

export default class Email extends React.Component {
  constructor(props) {
    super(props);
    this.handleValidation = this.handleValidation.bind(this);
  }
  handleValidation() {
    const email = this.refs.email.value;
    if (email !== '') {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        const validationResult = checkEmail(email);
        this.props.validateEmail({
          validation: {
            isValidEmail: validationResult.isValidEmail,
            message: validationResult.message,
          },
        });
      }, this.props.validationDelay);
    }
  }
  render() {
    return (
      <input
        className={this.props.className}
        name="email"
        type="email"
        ref="email"
        placeholder={this.props.placeholder}
        onKeyUp={this.handleValidation}
        onBlur={this.handleValidation}
      />
    );
  }
}

Email.defaultProps = {
  validationDelay: 1000,
};

if (process.env.NODE_ENV !== 'production') {
  Email.propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    validationDelay: React.PropTypes.number,
    handleValidation: React.PropTypes.func,
    validateEmail: React.PropTypes.func,
  };
}
