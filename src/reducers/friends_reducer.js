import _ from 'lodash';
import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';

import {
  EDIT_MY_INFO,
  ADD_FRIEND,
  ADDED_ME
} from '../actions/types';

const INITIAL_STATE = {
  myFriends: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.friends;
    case EDIT_MY_INFO:
      return { ...state, myInfo: { name: action.payload.name, number: action.payload.number } };
    case ADD_FRIEND:
      return state;
      // return { ...state, myFriends: _.uniqBy([...state.friends, action.payload], 'number') };
    case ADDED_ME:
      return { ...state, addedMe: _.uniqBy([...state.addedMe, action.payload], 'number') };
    default:
      return state;
  }
}
