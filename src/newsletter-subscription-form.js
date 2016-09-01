/* global fetch */
import React from 'react';
import serialize from 'form-serialize';
import 'whatwg-fetch';
import Message from './newsletter-subscription-message';
import Submit from './newsletter-subscription-submit';
import Email from './newsletter-subscription-email';

function checkStatus(response) {
  const httpStatusOK = 200;
  const httpStatusMultipleChoices = 300;
  if (response.status < httpStatusOK || response.status >= httpStatusMultipleChoices) {
    const connectionError = new Error(response.statusText);
    connectionError.response = response;
    throw connectionError;
  }
  return response;
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleValidationMessage = this.handleValidationMessage.bind(this);
    this.state = { answer: null, validation: true };
  }
  handleValidationMessage(validationResult) {
    this.setState(validationResult);
  }
  handleFormSubmit(event) {
    event.preventDefault();
    fetch(this.props.action, {
      method: 'POST',
      body: serialize(event.target),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(checkStatus)
    .then((dataResponse) => {
      let answer = {
        subscriptionError: false,
        message: this.props.successMessage,
      };
      if (dataResponse.errorMessage) {
        answer = {
          subscriptionError: true,
          message: dataResponse.errorMessage,
        };
      }
      this.setState({
        answer,
      });
    }).catch((connectionError) => {
      const answer = {
        subscriptionError: true,
        message: `Error communicating with the server: ${ connectionError.message }`,
      };
      this.setState({ answer });
    });
  }
  render() {
    let message = null;
    let messageClassNameModifier = '';
    const children = [];
    this.props.children.forEach((child) => {
      let newChild = child;
      if (child.type === Message && (this.state.answer || this.state.validation)) {
        if (this.state.answer) {
          message = this.state.answer.message;
          messageClassNameModifier = (this.state.answer.subscriptionError) ? '--error' : '--success';
        } else if (this.state.validation) {
          message = this.state.validation.message;
          messageClassNameModifier = (this.state.validation.isValidEmail) ? '--is-valid' : '--is-not-valid';
        }
        const messageElementClassNameModifier = (messageClassNameModifier) ?
          ` ${ this.props.className }${ messageClassNameModifier }` : '';
        newChild = React.cloneElement(child, {
          className: `${ child.props.className } ${ messageElementClassNameModifier }`,
          children: message,
          key: 'message',
        });
      } else if (child.type === Submit) {
        newChild = React.cloneElement(child, Object.assign(
          {},
          child.props,
          {
            disable: this.state.validation && !this.state.validation.isValidEmail,
            key: 'submit',
          }
        ));
      } else if (child.type === Email) {
        newChild = React.cloneElement(child, Object.assign(
          {},
          child.props,
          {
            validateEmail: this.handleValidationMessage,
            key: 'email',
          }
        ));
      }
      children.push(newChild);
    });
    const formClassNameModifier = (messageClassNameModifier) ?
      ` ${ this.props.className }${ messageClassNameModifier }` : '';
    return (
      <form
        className={`${ this.props.className }${ formClassNameModifier }`}
        method="post"
        action={this.props.action}
        onSubmit={this.handleFormSubmit}
        ref="newsletterSubscribeForm"
        noValidate
      >
        {children}
      </form>
    );
  }
}

Form.defaultProps = {
  children: null,
  className: 'newsletter-subscription',
  successMessage: 'Thank you for subscribe',
};

if (process.env.NODE_ENV !== 'production') {
  Form.propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.node),
    ]),
    className: React.PropTypes.string,
    successMessage: React.PropTypes.string,
    action: React.PropTypes.string,
  };
}
