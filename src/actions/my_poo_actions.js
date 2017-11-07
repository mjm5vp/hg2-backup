import { ADD_POO, IDENTIFY_STACK_LOCATION } from './types';

export const addPoo = ({ currentPooName, datetime, description, location }) => {
  console.log('addPoo');
  return {
    type: ADD_POO,
    payload: { currentPooName, datetime, description, location }
  };
};

export const identifyStackLocation = (location) => {
  console.log('identifyStackLocation');
  return {
    type: IDENTIFY_STACK_LOCATION,
    payload: location
  };
};
