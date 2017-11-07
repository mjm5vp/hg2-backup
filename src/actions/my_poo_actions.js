import { ADD_POO, IDENTIFY_STACK_LOCATION, INCREASE_UID } from './types';

export const addPoo = ({ uid, currentPooName, datetime, description, location }) => {
  console.log('addPoo');
  return {
    type: ADD_POO,
    payload: { uid, currentPooName, datetime, description, location }
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
