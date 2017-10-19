import { ADD_POO } from '../actions/types';

const INITIAL_STATE = {
  myPoos: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_POO:
      return { ...state, myPoos: [...state.myPoos, action.payload] };
    default:
      return state;
  }
}
