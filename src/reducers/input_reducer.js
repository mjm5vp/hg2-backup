import moment from 'moment';

import {
  SELECT_POO,
  CHANGE_DESCRIPTION_TEXT,
  CHANGE_DATETIME,
  SET_LOCATION,
  RESET_INPUT
 } from '../actions/types';

const INITIAL_STATE = {
  currentPooName: 'basketball',
  datetime: moment(),
  description: '',
  location: {
    latitude: null,
    longitude: null
  }
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_POO:
      return { ...state, currentPooName: action.payload };
    case CHANGE_DESCRIPTION_TEXT:
      return { ...state, description: action.payload };
    case CHANGE_DATETIME:
      return { ...state, datetime: action.payload };
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case RESET_INPUT:
      return INITIAL_STATE
    default:
      return state;
  }
}
