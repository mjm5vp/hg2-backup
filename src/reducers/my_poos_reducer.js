import { ADD_POO, EDIT_POOS, IDENTIFY_STACK_LOCATION, INCREASE_UID } from '../actions/types';

const INITIAL_STATE = {
  uid: 0,
  myPoos: [],
  selectedStackLocation: {}
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case INCREASE_UID:
      const uid = state.uid + 1;
      return { ...state, uid };
    case ADD_POO:
      return { ...state, myPoos: [...state.myPoos, action.payload] };
    case EDIT_POOS:
      return { ...state, myPoos: action.payload };
    case IDENTIFY_STACK_LOCATION:
      return { ...state, selectedStackLocation: action.payload };
    default:
      return state;
  }
}