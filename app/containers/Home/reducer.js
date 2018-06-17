/*
 *
 * Home reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_DATE,
  CHANGE_DAYS,
  CHANGE_COUNTRY,
} from './constants';

const initialState = fromJS({
  date: '',
  days: 0,
  country: '',
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DATE:
      return state.set('date', action.payload.date);

    case CHANGE_DAYS:
      return state.set('days', action.payload.days);

    case CHANGE_COUNTRY:
      return state.set('country', action.payload.country);

    default:
      return state;
  }
}

export default homeReducer;
