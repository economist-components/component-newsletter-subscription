import React from 'react';
import Validation from 'react-validation';
import serialize from 'form-serialize';
/* eslint-disable no-unused-vars */
import validator from 'validator';
/* eslint-enable no-unused-vars */
import 'whatwg-fetch';
import NewsletterSubscriptionMessage from './newsletter-subscription-message';

function checkStatus(response) {
  const httpStatusOK = 200;
  const httpStatusMultipleChoices = 300;
  if (response.status < httpStatusOK && response.status >= httpStatusMultipleChoices) {
    const connectionError = new Error(response.statusText);
    connectionError.response = response;
    throw connectionError;
  }
  return response;
}


export function NewsletterSubscriptionSubmit() {
  return true;
}

if (process.env.NODE_ENV !== 'production') {
  NewsletterSubscriptionSubmit.propTypes = {
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    value: React.PropTypes.string,
  };
}

export function NewsletterSubscriptionEmail() {
  return true;
}

if (process.env.NODE_ENV !== 'production') {
  NewsletterSubscriptionEmail.propTypes = {
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    children: React.PropTypes.node,
  };
}

export class NewsletterSubscription extends React.Component {
  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  componentWillMount() {
    // Extend Validation with custom rules
    Validation.extendErrors({
      isRequired: {
        className: `${ this.props.className }__email-empty`,
        message: 'Required',
        rule: (value) => Boolean(validator.trim(value)),
      },
      isEmail: {
        className: `${ this.props.className }__email-not-valid`,
        // validator already has strong email-pattern, so we don't have to extend it by custom
        message: 'Should be a valid email',
      },
    });
    this.setState({
      answer: null,
    });
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
    let responseClassName = '';
    let message = null;
    const children = [];
    this.props.children.forEach((child) => {
      let newChild = child;
      if (child.type === NewsletterSubscriptionMessage) {
        if (this.state.answer) {
          message = this.state.answer.message;
          let messageClassName = '';
          if (this.state.answer.subscriptionError) {
            messageClassName = ` ${ this.props.className }__message--error`;
            responseClassName = ` ${ this.props.className }__form--error`;
          } else {
            messageClassName = ` ${ this.props.className }__message--success`;
            responseClassName = ` ${ this.props.className }__form--success`;
          }
          newChild = React.cloneElement(child, {
            className: `child.props.className ${ messageClassName }`,
            children: message,
          });
        }
      }
      if (child.type === NewsletterSubscriptionEmail) {
        newChild = (<Validation.Input
          className={child.props.className}
          name="email"
          type="email"
          invalidClassName={`${ child.props.className }__email--error`}
          blocking="input"
          placeholder={child.props.placeholder}
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
        />);
      }
      if (child.type === NewsletterSubscriptionSubmit) {
        newChild = (  <Validation.Button
            blocking="button"
            value={child.props.value}
            className={child.props.className}
          >
            {child.props.children}
          </Validation.Button>);
      }
      children.push(newChild);
    });

    return (
      <Validation.Form
        className={`${ this.props.className }__form${ responseClassName }`}
        method="post"
        action={this.props.action}
        onSubmit={this.handleFormSubmit}
        ref="newsletterSubscribeForm"
        noValidate
      >
        {children}
      </Validation.Form>
    );
  }
}

NewsletterSubscription.defaultProps = {
  children: null,
  className: 'newsletter-subscription',
  successMessage: 'Thank you for subscribe',
};

if (process.env.NODE_ENV !== 'production') {
  NewsletterSubscription.propTypes = {
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
