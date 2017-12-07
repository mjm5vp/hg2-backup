import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';

import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  EDIT_MY_INFO
 } from '../actions/types';

 const INITIAL_STATE = {
   myInfo: {
     name: '',
     number: ''
   },
   token: null
 };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.auth;
    case EDIT_MY_INFO:
      return { ...state, myInfo: { name: action.payload.name, number: action.payload.number } };
    case LOGIN_SUCCESS:
      return { token: action.payload };
    case LOGIN_FAIL:
      return { token: null };
    default:
      return state;
  }
}
