import moment from 'moment';

import {
  SET_UID,
  SELECT_POO,
  CHANGE_DESCRIPTION_TEXT,
  CHANGE_DATETIME,
  SET_LOCATION,
  FILL_INPUT,
  RESET_INPUT
 } from '../actions/types';

const INITIAL_STATE = {
  currentPooName: 'basketball',
  datetime: moment(),
  description: '',
  location: {
    latitude: null,
    longitude: null
  },
  inputUID: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_UID:
      return { ...state, inputUID: action.payload };
    case SELECT_POO:
      return { ...state, currentPooName: action.payload };
    case CHANGE_DESCRIPTION_TEXT:
      return { ...state, description: action.payload };
    case CHANGE_DATETIME:
      return { ...state, datetime: action.payload };
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case FILL_INPUT:
      const { inputUID, currentPooName, description, datetime, location } = action.payload;
      return { inputUID, currentPooName, description, datetime, location };
    case RESET_INPUT:
      return INITIAL_STATE;
    default:
      return state;
  }
}
