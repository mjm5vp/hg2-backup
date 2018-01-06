import firebase from 'firebase';
import _ from 'lodash';

import { SET_FRIENDS, ADD_FRIEND, ADDED_ME, ACCEPT_FRIEND, SET_SENT_TO_ME } from './types';

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

  try {
    firebase.database().ref(`/users/${currentUser.uid}/myFriends/`)
      .push({ name, number });

    dispatch({ type: ACCEPT_FRIEND, payload: { name, number } });
  } catch (err) {
    console.log('could not accept friend');
    return {};
  }
};

export const addFriend = (friend) => {
  const { name, number } = friend;
  try {
    firebase.database().ref(`/users/${friend.number}/addedMe/`)
      .push({ name, number });

    return {
      type: ADD_FRIEND,
      payload: null
    };
  } catch (err) {
    console.log('could not add friend');
    return {};
  }
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

export const sendToFriendsAction = (friends, poo, myInfo) => async dispatch => {
  // const { currentUser } = firebase.auth();

  friends.forEach(async friend => {
    try {
      await firebase.database().ref(`users/${friend.number}/sentToMe`)
        .push({ from: myInfo, poo });
    } catch (err) {
      console.log(`could not send to ${friend.name}`);
    }
  });
};

export const fetchSentToMe = () => async dispatch => {
  const { currentUser } = firebase.auth();

  let sentToMe = [];

  try {
    await firebase.database().ref(`users/${currentUser.uid}/sentToMe`)
      .once('value', snapshot => {
        if (snapshot.val()) {
          sentToMe = snapshot.val();
        }
      });

    sentToMe = typeof sentToMe === 'object' ? _.values(sentToMe) : sentToMe;

    // console.log('sentToMe');
    // console.log(sentToMe);

    dispatch({ type: SET_SENT_TO_ME, payload: sentToMe });
  } catch (err) {
    console.log('could not fetch sentToMe');
  }
};
