import moment from 'moment';

export function getNumWeeksInMonth(currentMonth, currentYear) {
  const date = moment().set({
    year: currentYear,
    month: currentMonth - 1,
  });

  if (currentMonth === 12) {
    return (date.weeksInYear() - date.startOf('month').weeks()) + 2;
  }

  return (date.endOf('month').weeks() - date.startOf('month').weeks()) + 1;
}

// Fetching all the countries available
export function getCountries() {
  // I will put the parameter in the url just as the key since this is a public api with no sensitive data
  const countriesURL = 'https://kayaposoft.com/enrico/json/v2.0/?action=getSupportedCountries';
  return fetch(countriesURL);
}

// Fetching all holidays for that country
export function getHolidays(initialDate, country, countries) {
  // Since holidays in some countries are based on regions like in the US I will use the first region in each country object
  // Bc the exercise only accepts one field as country
  // And I really don't know how real is this API, it was the only one free I found

  // I will put the parameter in the url just as the key since this is a public api with no sensitive data
  let holidaysURL = `https://kayaposoft.com/enrico/json/v2.0/?action=getHolidaysForDateRange&fromDate=${initialDate}&toDate=1-1-2050&country=${country}&holidayType=public_holiday`;
  let countryObj = {};

  countries.forEach((item) => {
    if (item.label === country) {
      countryObj = item;
    }
  });

  // Validating if region exist, this will only happend for countries depending on regions
  if (countryObj.regions && countryObj.regions.length > 0) {
    holidaysURL += `&region=${countryObj.regions[0]}`;
  }

  return fetch(holidaysURL);
}

// function to get suggestion for the autocomplete
export function getSuggestions(value, countries) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 ? [] : countries.filter((suggestion) => {
    const keep = count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}
