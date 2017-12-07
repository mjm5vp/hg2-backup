import _ from 'lodash';
import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';

import {
  SET_FRIENDS,
  ADD_FRIEND,
  ADDED_ME,
  ACCEPT_FRIEND
} from '../actions/types';

const INITIAL_STATE = {
  myInfo: { name: '', number: '' },
  myFriends: [],
  addedMe: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.friends;
    case SET_FRIENDS:
      return { ...state, myFriends: _.uniqBy([...state.myFriends, action.payload], 'number') };
    case ACCEPT_FRIEND:
      return { ...state, myFriends: _.uniqBy([...state.myFriends, action.payload], 'number') };
    case ADD_FRIEND:
      return state;
    case ADDED_ME:
      return { ...state, addedMe: _.uniqBy([...state.addedMe, action.payload], 'number') };
    default:
      return state;
  }
}
