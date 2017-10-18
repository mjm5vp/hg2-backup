import { SELECT_POO } from './types';

export const selectPoo = (pooName) => {
  console.log('selectPoo action');
  console.log(pooName);
  return {
    type: SELECT_POO,
    payload: pooName
  };
};
