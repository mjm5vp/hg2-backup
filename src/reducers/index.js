import { combineReducers } from 'redux';
import input from './input_reducer';
import pooReducer from './my_poos_reducer';

export default combineReducers({
  input,
  pooReducer
});
