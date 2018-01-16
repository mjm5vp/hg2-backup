import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
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

export const deleteUser = (token) => async dispatch => {
  const { currentUser } = firebase.auth();

  try {
    await firebase.auth().signInWithCustomToken(token);
    await currentUser.delete();
    await firebase.database().ref(`users/${currentUser.uid}`)
      .remove();
    authLogout();
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

export const authLogout = () => {
  console.log('authLogout action');
  firebase.auth().signOut();
  AsyncStorage.removeItem('fb_token', () => {});
  return { type: LOGIN_FAIL };
};

export const syncPropsWithDb = ({ phone, myPoos, myFriends }) => async dispatch => {
  let dbMyPoos = [];
  let dbMyFriends = [];
  let dbMyInfo = {};
  let dbAddedMe = [];

  console.log('myPoos');
  console.log(myPoos);

  try {
    await firebase.database().ref(`/users/${phone}`)
      .once('value', snapshot => {
        dbMyPoos = snapshot.val().myPoos ? snapshot.val().myPoos : [];
        dbMyFriends = snapshot.val().myFriends ? snapshot.val().myFriends : [];
        dbMyInfo = snapshot.val().myInfo ? snapshot.val().myInfo : {};
        dbAddedMe = snapshot.val().addedMe ? snapshot.val().myInfo : [];
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

    console.log('syncPropsWithDb success');

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
  } catch (err) {
    console.log('sync error');
    console.log(err);
  }
};

export const setNotificationToken = ({ pushToken }) => async dispatch => {
  const { currentUser } = firebase.auth();

  try {
    await firebase.database().ref(`users/${currentUser.uid}/notifications`)
      .set({ pushToken });
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
