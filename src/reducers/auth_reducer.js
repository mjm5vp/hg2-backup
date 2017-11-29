import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';

import {
  LOGIN_SUCCESS,
  LOGIN_FAIL
 } from '../actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.auth;
    case LOGIN_SUCCESS:
      return { token: action.payload };
    case LOGIN_FAIL:
      return { token: null };
    default:
      return state;
  }
}
