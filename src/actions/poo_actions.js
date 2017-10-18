import {
  SELECT_POO,
  CHANGE_DESCRIPTION_TEXT
} from './types';

export const selectPoo = (pooName) => {
  console.log('selectPoo action');
  console.log(pooName);
  return {
    type: SELECT_POO,
    payload: pooName
  };
};

export const updateDescription = ({ text }) => {
  console.log(text)
  return {
    type: CHANGE_DESCRIPTION_TEXT,
    payload: text
  };
};
