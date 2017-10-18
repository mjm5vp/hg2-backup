import { SELECT_POO } from '../actions/types';

const INITIAL_STATE = {
  currentPooName: 'basketball'
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_POO:
      console.log('reducer')
      console.log(action.payload)
      return { currentPooName: action.payload };
    default:
      return state;
  }
}