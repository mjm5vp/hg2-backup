import { combineReducers } from 'redux';
import currentPooName from './input_reducer';

console.log('reducer index: ' + currentPooName)

export default combineReducers({
  currentPooName
});
