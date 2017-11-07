import { ADD_POO, IDENTIFY_STACK_LOCATION } from '../actions/types';

const INITIAL_STATE = {
  myPoos: [],
  selectedStackLocation: {}
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_POO:
      return { ...state, myPoos: [...state.myPoos, action.payload] };
    case IDENTIFY_STACK_LOCATION:
      console.log("action.payload:")
      console.log(action.payload)
      return { ...state, selectedStackLocation: action.payload };
    default:
      return state;
  }
}
