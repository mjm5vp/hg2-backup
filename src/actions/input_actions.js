import {
  SELECT_POO,
  SET_UID,
  CHANGE_DESCRIPTION_TEXT,
  CHANGE_DATETIME,
  SET_LOCATION,
  FILL_INPUT,
  RESET_INPUT
} from './types';

export const setUID = (uid) => {
  return {
    type: SET_UID,
    payload: uid
  };
};

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

export const fillInput = ({ currentPooName, description, datetime, location }) => {
  return {
    type: FILL_INPUT,
    payload: { currentPooName, description, datetime, location }
  };
};

export const resetInput = () => {
  return {
    type: RESET_INPUT,
    payload: null
  };
};
