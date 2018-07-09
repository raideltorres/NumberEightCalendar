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
import moment from 'moment';

// Importing the defined actions
import * as HomeActions from '../../containers/Home/actions';

// Creating styles
const CalendarContainer = styled.div`
  padding: 4rem;

  .inputContainer {
    margin: 1rem;
  }

  table {
    width: 14rem;
    border-collapse: separate;
    border-spacing: 0.1rem;
    font-size: 0.8rem;
    margin-top: 2rem;

    .month-year-cell {
      background-color: #f6faeb;
    }

    td {
      width: 2rem;
      height: 2rem;
      text-align: center;

      &.active {
        background-color: #c3db9f;
      }

      &.inactive {
        background-color: #cccccc;
      }
    }
  }
`;

// Calendar component
class Calendar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      calDaysLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      calMonthsLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      calDaysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      calendar: true,
    };
  }

  getNumWeeksInMonth(currentMonth, currentYear) {
    const date = moment().set({
      year: currentYear,
      month: currentMonth - 1,
    });

    if (currentMonth === 12) {
      return (date.weeksInYear() - date.startOf('month').weeks()) + 2;
    }

    return (date.endOf('month').weeks() - date.startOf('month').weeks()) + 1;
  }

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

  generateCalendar() {
    this.setState({
      calendar: true,
    });
  }

  renderCalendar() {
    let pendingDays = this.props.calendarData.days; // Days to extend the calendar
    let date = this.props.calendarData.date.split('-'); // Starting date
    let currentYear = Number(date[0]); // Current year of the starting date
    let currentMonth = Number(date[1]); // Current month of the starting date
    let currentDay = Number(date[2]); // Current day of the starting date

    // Starting date object and substracting one month since months in moment starts in 0
    date = moment().set({
      year: currentYear,
      month: currentMonth - 1,
      date: currentDay,
    });

    const dayOfWeek = date.weekday(); // Getting the day of the week
    let weekOfMonth = (date.week() - moment(date).startOf('month').week()) + 1; // Getting the week number in the current month
    let weeksInMonth = this.getNumWeeksInMonth(currentMonth, currentYear); // Getting the number of weeks in the current month
    let startingDay = currentDay - dayOfWeek;

    // ------------------------------------------
    // Generating Calendar
    // ------------------------------------------

    // Creating the base objects to push the components of the table
    const calendar = [];
    let tempDayWeek = 0;

    // Going trough all the months
    while (pendingDays > 0) {
      const weeks = [];

      // Going trough all the weeks in the current month
      while (weekOfMonth <= weeksInMonth && pendingDays > 0) {
        const days = [];

        // Going trough all the days in the current week
        for (let i = 0; i < 7; i += 1) {
          let day = null;

          // Validating early end
          if (pendingDays <= 0) {
            startingDay = 32;
          }

          if (startingDay < currentDay) {
            day = <td key={Math.random()} className="inactive" />;
          } else if (startingDay > this.state.calDaysInMonth[currentMonth - 1]) {
            day = <td key={Math.random()} className="inactive" />;

            // Validating the end of month
            tempDayWeek = i;
            startingDay = -10;
          } else {
            day = <td key={Math.random()} className="active">{startingDay}</td>;

            // We are only restarting a day if it was a valid day
            pendingDays -= 1;

            // Validating if the month ends with 0 inactive days
            if (startingDay + tempDayWeek === weeksInMonth * 7) {
              tempDayWeek = 0;
              startingDay = -10;
            }
          }

          startingDay += 1;
          days.push(day);
        }

        const week = <tr key={Math.random()}>{days}</tr>;
        weeks.push(week);
        weekOfMonth += 1;
      }

      const month = (
        <Grid
          item
          xs={12}
          key={Math.random()}
          container
          alignItems={'center'}
          justify={'center'}
        >
          <table>
            <thead>
              <tr>
                {this.state.calDaysLabels.map((item) => <th key={Math.random()}>{ item }</th>)}
              </tr>
              <tr>
                <th colSpan="7" className="month-year-cell">{this.state.calMonthsLabels[currentMonth - 1]} {currentYear}</th>
              </tr>
            </thead>
            <tbody>
              {weeks}
            </tbody>
          </table>
        </Grid>
      );

      calendar.push(month);

      if (currentMonth < 12) {
        currentMonth += 1;
      } else {
        currentMonth = 1;
        currentYear += 1;
      }

      weekOfMonth = 1;
      startingDay = 1 - tempDayWeek;
      currentDay = 1;

      weeksInMonth = this.getNumWeeksInMonth(currentMonth, currentYear);
    }

    return calendar;
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
            <Button variant="contained" color="primary" onClick={() => { this.generateCalendar(); }}>
              Generate Calendar
            </Button>
          </Grid>
          { this.state.calendar ? this.renderCalendar() : null }
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
