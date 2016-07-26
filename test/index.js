import 'babel-polyfill';
import NewsletterSubscription from '../src';
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
chai.use(chaiEnzyme()).should();
describe('NewsletterSubscription', () => {

  it('renders a React element', () => {
    React.isValidElement(<NewsletterSubscription />).should.equal(true);
  });

  describe('Rendering', () => {
    let rendered = null;
    let newsletterSubscription = null;
    beforeEach(() => {
      rendered = mount(<NewsletterSubscription />);
      newsletterSubscription = rendered.find('.newsletter-subscription');
    });

    it('renders a top level div.newsletter-subscription', () => {
      newsletterSubscription.should.have.tagName('div');
      newsletterSubscription.should.have.className('newsletter-subscription');
    });

    xit('renders <FILL THIS IN>', () => {
      newsletterSubscription.should.have.exactly(1).descendants('.the-descendent-class');
      newsletterSubscription.find('.the-descendent-class').should.have.tagName('TAG');
    });

  });

});
