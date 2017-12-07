import firebase from 'firebase';
import _ from 'lodash';

import { SET_FRIENDS, ADD_FRIEND, ADDED_ME, ACCEPT_FRIEND } from './types';

export const setFriendsFromDb = () => async dispatch => {
  const { currentUser } = firebase.auth();
  let dbMyFriends = [];

  await firebase.database().ref(`users/${currentUser.uid}/myFriends`)
    .once('value', snapshot => {
      if (snapshot.val()) {
        dbMyFriends = snapshot.val();
      }
    });

  dbMyFriends = typeof dbMyFriends === 'object' ? _.values(dbMyFriends) : dbMyFriends;
  dbMyFriends = dbMyFriends.map(friend => {
    return { ...friend, number: String(friend.number) };
  });

  dispatch({ type: SET_FRIENDS, payload: dbMyFriends });
};

export const acceptFriend = ({ name, number }) => async dispatch => {
  const { currentUser } = firebase.auth();
  firebase.database().ref(`/users/${currentUser.uid}/myFriends/`)
    .push({ name, number });

  dispatch({ type: ACCEPT_FRIEND, payload: { name, number } });
};

export const addFriend = (friend) => {
  console.log(friend);
  const { name, number } = friend;
  firebase.database().ref(`/users/${friend.number}/addedMe/`)
    .push({ name, number });

  return {
    type: ADD_FRIEND,
    payload: null
  };
};

export const checkAddedMe = async dispatch => {
  const { currentUser } = firebase.auth();
  let addedMe = [];
  await firebase.database().ref(`users/${currentUser.uid}`)
    .once('value', snapshot => {
      if (snapshot.val()) {
        addedMe = snapshot.val();
      }
    });

  dispatch({
    type: ADDED_ME,
    payload: addedMe
  });
};
