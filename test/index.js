import 'babel-polyfill';
import NewsletterSubscription from '../src/';
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
chai.use(chaiEnzyme()).should();

describe('NewsletterSubscription', () => {

  it('renders a React element', () => {
    React.isValidElement(<NewsletterSubscription.Form />).should.equal(true);
  });

  describe('Rendering', () => {
    let rendered = null;
    let newsletterSubscription = null;
    beforeEach(() => {
      rendered = mount(
        <NewsletterSubscription.Form
          action="/api/newsletter-subscription"
          validationDelay={500}
          className="newsletter-subscription__form"
        >
          <input type="hidden" name="list" value="dev-wif-list" />
          <NewsletterSubscription.Message
            className="newsletter-subscription__message"
          />
          <NewsletterSubscription.Email
            className="newsletter-subscription__email"
            placeholder="Your e-mail here"
          />
          <NewsletterSubscription.Submit
            value="Submit this form"
            className="newsletter-subscription__submit-button"
          />
        </NewsletterSubscription.Form>
      );
      newsletterSubscription = rendered.find('.newsletter-subscription__form');
    });

    it('renders a top level div.newsletter-subscription', () => {
      newsletterSubscription.should.have.tagName('form');
      newsletterSubscription.should.have.className('newsletter-subscription__form');
    });
  });

});
