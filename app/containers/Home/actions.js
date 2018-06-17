/*
 *
 * Home actions
 *
 */

import { CHANGE_DATE, CHANGE_DAYS, CHANGE_COUNTRY } from './constants';

export function changeDate(dt) {
  return {
    type: CHANGE_DATE,
    payload: {
      date: dt,
    },
  };
}

export function changeDays(day) {
  return {
    type: CHANGE_DAYS,
    payload: {
      days: day,
    },
  };
}

export function changeCountry(cntry) {
  return {
    type: CHANGE_COUNTRY,
    payload: {
      country: cntry,
    },
  };
}
