import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import injectReducer from '../../utils/injectReducer';
import makeSelectHome from './selectors';
import reducer from './reducer';

// Importing the base component
import Calendar from '../../components/Calendar';

class Home extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Calendar calendarData={this.props.home} dispatch={this.props.dispatch} />
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  home: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });

export default compose(
  withReducer,
  withConnect,
)(Home);
