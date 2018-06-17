/* ******************************************** */
/*            Calendar Component                */
/* ******************************************** */

// Importing the base boilerplate stuff
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// Importing the defined actions
import * as HomeActions from '../../containers/Home/actions';

// Creating styles
const CalendarContainer = styled.div`
  padding: 4rem;

  .inputContainer {
    margin: 1rem;
  }
`;

// Calendar component
class Calendar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  changeDate(event) {
    // Is not really needed the use of redux since I will use only one component
    this.props.dispatch(HomeActions.changeDate(event.target.value));
  }

  changeDays(event) {
    // Is not really needed the use of redux since I will use only one component
    this.props.dispatch(HomeActions.changeDays(event.target.value));
  }

  changeCountry(event) {
    // Is not really needed the use of redux since I will use only one component
    this.props.dispatch(HomeActions.changeCountry(event.target.value));
  }

  renderCalendar() {
    return this.props.calendarData.country;
  }

  render() {
    // Main Container with the rest of components
    return (
      <CalendarContainer>
        <Grid container spacing={8}>
          <Grid
            container
            alignItems={'center'}
            justify={'center'}
            item
            xs={12}
          >
            <div className="inputContainer">
              <TextField
                id="dateInput"
                label="Date"
                type="date"
                onChange={(e) => { this.changeDate(e); }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="inputContainer">
              <TextField
                id="daysInput"
                label="Days"
                type="number"
                onChange={(e) => { this.changeDays(e); }}
              />
            </div>
            <div className="inputContainer">
              <TextField
                id="countryInput"
                label="Country"
                onChange={(e) => { this.changeCountry(e); }}
              />
            </div>
            <Button variant="contained" color="primary">
              Generate Calendar
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            { this.renderCalendar() }
          </Grid>
        </Grid>
      </CalendarContainer>
    );
  }
}

Calendar.propTypes = {
  dispatch: PropTypes.func,
  calendarData: PropTypes.object,
};

export default Calendar;
