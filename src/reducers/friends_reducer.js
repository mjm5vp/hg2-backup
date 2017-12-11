import _ from 'lodash';
import { PERSIST_REHYDRATE } from 'redux-persist/lib/constants';

import {
  SET_FRIENDS,
  ADD_FRIEND,
  ADDED_ME,
  ACCEPT_FRIEND,
  SET_SENT_TO_ME
} from '../actions/types';

const INITIAL_STATE = {
  myInfo: { name: '', number: '', avatar: '' },
  myFriends: [],
  addedMe: [],
  sentToMe: []
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      return action.payload.friends;
    case SET_FRIENDS:
      return { ...state, myFriends: action.payload };
    case ACCEPT_FRIEND:
      return { ...state, myFriends: _.uniqBy([...state.myFriends, action.payload], 'number') };
    case ADD_FRIEND:
      return state;
    case ADDED_ME:
      return { ...state, addedMe: _.uniqBy([...state.addedMe, action.payload], 'number') };
    case SET_SENT_TO_ME:
      console.log('set sent to me reducer');
      console.log(action.payload);
      return { ...state, sentToMe: action.payload };
    default:
      return state;
  }
}
