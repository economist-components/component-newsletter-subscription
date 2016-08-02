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

let timeout = null;
export default class Form extends React.Component {
  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }
  componentWillMount() {
    this.setState({
      answer: null,
    });
  }
  checkEmail(email) {
    /* eslint-disable max-len */
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /* eslint-enable max-len */
    let message = '';
    let isValidEmail = true;
    if (!emailRegEx.test(email)) {
      message = 'Email not valid';
      isValidEmail = false;
    }

    return {
      message,
      isValidEmail,
    };
  }
  handleValidation() {
    const email = this.refs.newsletterSubscribeForm.querySelector('[type=email]').value;
    if (email !== '') {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        const validationResult = this.checkEmail(email);
        this.setState({
          validation: {
            isValidEmail: validationResult.isValidEmail,
            message: validationResult.message,
          },
        });
      }, this.props.validationDelay);
    }
  }
  handleFormSubmit(event) {
    event.preventDefault();
    /* eslint-disable no-undef */
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
      /* eslint-disable no-console */
      console.log('Request failed', connectionError);
      /* eslint-enable no-console */
      const answer = {
        subscriptionError: true,
        message: connectionError,
      };
      this.setState(answer);
    });
    /* eslint-enable no-undef */
  }
  render() {
    let message = null;
    let messageClassNameModifier = '';
    const children = [];
    /* eslint-disable complexity */
    this.props.children.forEach((child) => {
    /* eslint-enable complexity */
      let newChild = child;
      if (child.type === Message) {
        if (this.state.answer || this.state.validation) {
          if (this.state.answer) {
            message = this.state.answer.message;
            messageClassNameModifier = (this.state.answer.subscriptionError) ? '--error' : '--success';
          } else if (this.state.validation) {
            message = this.state.validation.message;
            messageClassNameModifier = (this.state.validation.isValidEmail) ? '--is-valid' : '--is-not-valid';
          }
          /* eslint-disable max-len */
          const messageElementClassNameModifier = (messageClassNameModifier) ? ` ${ this.props.className }${ messageClassNameModifier }` : '';
          /* eslint-enable max-len */
          newChild = React.cloneElement(child, {
            className: `child.props.className ${ messageElementClassNameModifier }`,
            children: message,
            key: 'message',
          });
        }
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
            handleValidation: this.handleValidation,
            key: 'email',
          }
        ));
      }
      children.push(newChild);
    });
    /* eslint-disable max-len */
    const formClassNameModifier = (messageClassNameModifier) ? ` ${ this.props.className }${ messageClassNameModifier }` : '';
    /* eslint-enable max-len */
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
  validationDelay: 1000,
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
    validationDelay: React.PropTypes.number,
  };
}
