import { ADD_POO } from './types';

export const addPoo = ({ currentPooName, datetime, description }) => {
  console.log('addPoo')
  return {
    type: ADD_POO,
    payload: { currentPooName, datetime, description }
  };
};
