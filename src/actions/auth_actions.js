import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import axios from 'axios';
import _ from 'lodash';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  EDIT_POOS,
  EDIT_MY_INFO,
  SET_FRIENDS,
  ADDED_ME,
  SET_NOTIFICATION_TOKEN
} from './types';

export const editMyInfo = ({ name, number }) => {
  const strNumber = String(number);
  firebase.database().ref(`users/${number}/myInfo`)
    .set({ name, number: strNumber });

  return {
    type: EDIT_MY_INFO,
    payload: { name, number }
  };
};

export const deleteUser = () => async dispatch => {
  const ROOT_URL = 'https://us-central1-one-time-password-698fc.cloudfunctions.net';
  const { currentUser: { uid } } = firebase.auth();

  try {
    await axios.post(`${ROOT_URL}/deleteUser`, { uid });
    await firebase.database().ref(`users/${uid}`)
      .remove();
    authLogout();
    dispatch({ type: SET_NOTIFICATION_TOKEN, payload: null });
  } catch (err) {
    console.log(err);
    console.log('could not delete account');
  }
};

export const authLogin = ({ token, myPoos, phone, myFriends, myInfo }) => async dispatch => {
  //async await
  try {
    await firebase.auth().signInWithCustomToken(token);
    await syncPropsWithDb({ token, myPoos, phone, myFriends, myInfo });
    dispatch({ type: LOGIN_SUCCESS, payload: token });
  } catch (err) {
    console.log('authLogin action error');
    console.log(err);
    dispatch({ type: LOGIN_FAIL });
  }
};

export const authLogout = () => async dispatch => {
  console.log('authLogout action');
  try {
    await firebase.auth().signOut();
    dispatch({ type: LOGIN_FAIL });
  } catch (err) {
    console.log('authLogout error');
    console.log(err);
  }

};

export const syncPropsWithDb = ({ phone, myPoos, myFriends }) => async dispatch => {
  let dbMyPoos = [];
  let dbMyFriends = [];
  let dbMyInfo = {};
  let dbAddedMe = [];
  let dbPushToken = '';

  console.log('myPoos');
  console.log(myPoos);

  try {
    await firebase.database().ref(`/users/${phone}`)
      .once('value', snapshot => {
        dbMyPoos = snapshot.val().myPoos ? snapshot.val().myPoos : [];
        dbMyFriends = snapshot.val().myFriends ? snapshot.val().myFriends : [];
        dbMyInfo = snapshot.val().myInfo ? snapshot.val().myInfo : {};
        dbAddedMe = snapshot.val().addedMe ? snapshot.val().myInfo : [];
        dbPushToken = snapshot.val().pushToken ? snapshot.val().pushToken : '';
      });

    dbMyPoos = typeof dbMyPoos === 'object' ? _.values(dbMyPoos) : dbMyPoos;
    dbMyFriends = typeof dbMyFriends === 'object' ? _.values(dbMyFriends) : dbMyFriends;
    dbAddedMe = typeof dbAddedMe === 'object' ? _.values(dbAddedMe) : dbAddedMe;

    const combinedAndReducedPoos = combineAndDeleteDuplicates(dbMyPoos, myPoos);
    const combinedAndReducedFriends = combineAndDeleteFriendsByNumber(dbMyFriends, myFriends);

    firebase.database().ref(`/users/${phone}`)
      .update({
        myPoos: combinedAndReducedPoos,
        myFriends: combinedAndReducedFriends,
        // myInfo,
      });

    dispatch({
      type: EDIT_MY_INFO,
      payload: dbMyInfo
    });

    dispatch({
      type: EDIT_POOS,
      payload: combinedAndReducedPoos
    });

    dispatch({
      type: SET_FRIENDS,
      payload: combinedAndReducedFriends
    });

    dispatch({
      type: ADDED_ME,
      payload: dbAddedMe
    });

    dispatch({
      type: SET_NOTIFICATION_TOKEN,
      payload: dbPushToken
    });
  } catch (err) {
    console.log('sync error');
    console.log(err);
  }
};

export const setNotificationToken = ({ pushToken }) => async dispatch => {
  const { currentUser } = firebase.auth();

  try {
    await firebase.database().ref(`users/${currentUser.uid}/pushToken`)
      .set(pushToken);
    dispatch({
      type: SET_NOTIFICATION_TOKEN,
      payload: pushToken
    });
  } catch (err) {
    console.log(err);
    console.log('could not save notification token');
  }
};

const combineAndDeleteDuplicates = (array1, array2) => {
  const combinedArray = array1.concat(array2);

  return _.uniqWith(combinedArray, _.isEqual);
};

const combineAndDeleteFriendsByNumber = (array1, array2) => {
  const combinedArray = array1.concat(array2);

  return _.uniqBy(combinedArray, 'number');
};
