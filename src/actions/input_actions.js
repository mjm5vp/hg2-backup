import {
  SELECT_POO,
  CHANGE_DESCRIPTION_TEXT,
  CHANGE_DATETIME,
  SET_LOCATION,
  RESET_INPUT
} from './types';

export const selectPoo = (pooName) => {
  return {
    type: SELECT_POO,
    payload: pooName
  };
};

export const updateDescription = ({ text }) => {
  return {
    type: CHANGE_DESCRIPTION_TEXT,
    payload: text
  };
};

export const updateDateTime = (datetime) => {
  return {
    type: CHANGE_DATETIME,
    payload: datetime
  };
};

export const setLocation = (location) => {
  return {
    type: SET_LOCATION,
    payload: location
  };
};

export const resetInput = () => {
  return {
    type: RESET_INPUT,
    payload: null
  };
};
