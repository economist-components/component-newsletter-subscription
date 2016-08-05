import React from 'react';
import isEmail from 'validator/lib/isEmail';
import debounce from 'lodash.debounce';
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
    this.handleValidation = debounce(this.handleValidation, this.props.validationDelay).bind(this);
    this.state = { isValidEmail: false };
  }
  handleValidation() {
    const email = this.refs.email.value;
    if (email === '') {
      return false;
    }
    const validationResult = checkEmail(email);
    this.props.validateEmail({
      validation: {
        isValidEmail: validationResult.isValidEmail,
        message: validationResult.message,
      },
    });
    this.setState({ isValidEmail: validationResult.isValidEmail });
    return true;
  }
  render() {
    return (
      <input
        className={`this.props.className this.props.className${ this.state.isValidEmail ? '--valid' : '--invalid' }`}
        name="email"
        type="email"
        ref="email"
        placeholder={this.props.placeholder}
        onKeyUp={this.handleValidation}
        onChange={this.handleValidation}
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
