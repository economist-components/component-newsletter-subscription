import 'babel-polyfill';
import React from 'react';
import NewsletterSubscription from './';

export default (
  <NewsletterSubscription.Form
    action="/api/newsletter-subscription"
    className="newsletter-subscription__form"
  >
    <input type="hidden" name="list" value="dev-wif-list" />
    <NewsletterSubscription.Message
      className="newsletter-subscription__message"
    />
    <NewsletterSubscription.Email
      className="newsletter-subscription__email"
      placeholder="Your e-mail here"
      validationDelay={500}
    />
    <NewsletterSubscription.Submit
      value="Submit this form"
      className="newsletter-subscription__submit-button"
    />
  </NewsletterSubscription.Form>
);
