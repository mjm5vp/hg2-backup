import { ADD_POO, EDIT_POOS, IDENTIFY_STACK_LOCATION, INCREASE_UID } from './types';

export const addPoo = ({ inputUID, currentPooName, datetime, description, location }) => {
  console.log('addPoo');
  return {
    type: ADD_POO,
    payload: { inputUID, currentPooName, datetime, description, location }
  };
};

export const editPoos = (newPoos) => {
  console.log('editPoos');
  return {
    type: EDIT_POOS,
    payload: newPoos
  };
};

export const identifyStackLocation = (location) => {
  console.log('identifyStackLocation');
  return {
    type: IDENTIFY_STACK_LOCATION,
    payload: location
  };
};

export const increaseUID = () => {
  console.log('increaseUID');
  return {
    type: INCREASE_UID,
    payload: null
  };
};
