import moment from 'moment';

import {
  SELECT_POO,
  CHANGE_DESCRIPTION_TEXT,
  CHANGE_DATETIME
 } from '../actions/types';

const INITIAL_STATE = {
  currentPooName: 'basketball',
  datetime: moment()
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_POO:
      return { ...state, currentPooName: action.payload };
    case CHANGE_DESCRIPTION_TEXT:
      return { ...state, description: action.payload };
    case CHANGE_DATETIME:
      return { ...state, datetime: action.payload}
    default:
      return state;
  }
}
