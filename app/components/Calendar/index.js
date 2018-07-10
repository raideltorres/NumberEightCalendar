/* ******************************************** */
/*            Calendar Component                */
/* ******************************************** */

// Importing the base boilerplate stuff
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Autosuggest from 'react-autosuggest';
import moment from 'moment';

// Importing utils
import { getNumWeeksInMonth, getCountries, getHolidays, getSuggestions } from './utils';
// Importing the defined actions
import * as HomeActions from '../../containers/Home/actions';
// Importing styles
import CalendarContainer from './styles';
// Importing components
import Dialog from '../Dialog';

// Calendar component
class Calendar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    this.state = {
      calDaysLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      calMonthsLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      calDaysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      calendar: false,
      showDialog: false,
      countries: [],
      suggestions: [],
      holidays: [],
    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    // Promise to get all countries
    getCountries()
      .then((response) => response.json())
      .then((data) => {
        const countries = [];

        data.forEach((country) => {
          countries.push({
            label: country.countryCode,
            fullName: country.fullName,
            regions: country.regions,
          });

          this.setState({
            countries,
          });
        });
      });
  }

  getSuggestionValue(suggestion) {
    return suggestion.label;
  }

  // Function to validate before generating the calendar
  generateCalendar() {
    if (this.props.calendarData.date === '' || this.props.calendarData.country === '') {
      this.setState({ showDialog: true });
    } else {
      const initialDate = moment(this.props.calendarData.date);

      // Fetching all the holidays
      getHolidays(initialDate.format('D-M-Y'), this.props.calendarData.country, this.state.countries)
        .then((response) => response.json())
        .then((data) => {
          const holidays = [];

          data.forEach((holiday) => {
            holidays.push({
              year: holiday.date.year,
              month: holiday.date.month - 1,
              day: holiday.date.dayOfWeek,
            });
          });

          this.setState({
            holidays,
            calendar: true,
          });
        });
    }
  }

  // Redux action to change data
  changeDate(event) {
    // Is not really needed the use of redux since I will use only one component
    this.props.dispatch(HomeActions.changeDate(event.target.value));
  }

  // Redux action to change data
  changeDays(event) {
    // Is not really needed the use of redux since I will use only one component
    this.props.dispatch(HomeActions.changeDays(event.target.value));
  }

  // Redux action to change data
  changeCountry = (event, { newValue }) => {
    this.props.dispatch(HomeActions.changeCountry(newValue));
  }

  // Autosuggest will call this function every time you need to update suggestions.
  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.state.countries),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleClose = () => {
    this.setState({ showDialog: false });
  }

  renderInput(inputProps) {
    const { classes, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: ref,
          ...other,
        }}
      />
    );
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
    console.log(suggestion, query, isHighlighted);
    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          <span>{suggestion.label} ({suggestion.fullName})</span>
        </div>
      </MenuItem>
    );
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
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
    let weeksInMonth = getNumWeeksInMonth(currentMonth, currentYear); // Getting the number of weeks in the current month
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
            let className = i === 0 || i === 6 ? 'active weekend' : 'active';
            this.state.holidays.forEach((item) => {
              if (item.day === date.date() && item.month === date.month() && item.year === date.year()) {
                className += ' holiday';
              }
            });

            day = <td key={Math.random()} className={className}>{startingDay}</td>;

            // We are only restarting a day if it was a valid day
            pendingDays -= 1;
            date.add(1, 'd');

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

      weeksInMonth = getNumWeeksInMonth(currentMonth, currentYear);
    }

    return calendar;
  }

  render() {
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
            <div className="inputContainer large">
              <Autosuggest
                renderInputComponent={this.renderInput}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={{
                  placeholder: 'Search a country',
                  value: this.props.calendarData.country,
                  onChange: this.changeCountry,
                }}
              />
            </div>
          </Grid>
          <Grid
            container
            alignItems={'center'}
            justify={'center'}
            item
            xs={12}
          >
            <Button variant="contained" color="primary" onClick={() => { this.generateCalendar(); }}>
              Generate Calendar
            </Button>
          </Grid>
          { this.state.calendar ? this.renderCalendar() : null }
          <Dialog showDialog={this.state.showDialog} handleClose={this.handleClose} />
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
