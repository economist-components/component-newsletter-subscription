import 'babel-polyfill';
import React from 'react';
import { NewsletterSubscription, NewsletterSubscriptionSubmit, NewsletterSubscriptionEmail } from './';
import NewsletterSubscriptionMessage from './newsletter-subscription-message';

export default (
  <NewsletterSubscription action="/api/newsletter-subscription">
    <input type="hidden" name="list" value="dev-wif-list" />
    <NewsletterSubscriptionMessage
      className="newsletter-subscription__message"
    />
    <NewsletterSubscriptionEmail
      className="newsletter-subscription__email"
      placeholder="Your e-mail here"
    />
    <NewsletterSubscriptionSubmit
      value="Submit this form"
      className="newsletter-subscription__submit-button"
    />
  </NewsletterSubscription>
);
