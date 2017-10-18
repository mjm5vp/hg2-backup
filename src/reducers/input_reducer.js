import {
  SELECT_POO,
  CHANGE_DESCRIPTION_TEXT
 } from '../actions/types';

const INITIAL_STATE = {
  currentPooName: 'basketball'
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_POO:
      return { ...state, currentPooName: action.payload };
    case CHANGE_DESCRIPTION_TEXT:
      return { ...state, description: action.payload };
    default:
      return state;
  }
}
