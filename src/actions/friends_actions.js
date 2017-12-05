import firebase from 'firebase';

import { EDIT_MY_INFO, ADD_FRIEND, ADDED_ME } from './types';

export const editMyInfo = (myInfo) => {
  return {
    type: EDIT_MY_INFO,
    payload: myInfo
  };
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
