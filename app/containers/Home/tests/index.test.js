import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import Home from '../index';
import messages from '../messages';

describe('<Home />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(
      <Home />
    );
    expect(renderedComponent.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});
