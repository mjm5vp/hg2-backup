import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import { LOGIN_SUCCESS, LOGIN_FAIL, EDIT_POOS, EDIT_MY_INFO, SET_FRIENDS } from './types';

export const editMyInfo = ({ name, number }) => {
  const strNumber = String(number);
  firebase.database().ref(`users/${number}/myInfo`)
    .set({ name, number: strNumber });

  return {
    type: EDIT_MY_INFO,
    payload: { name, number }
  };
};

export const authLogin = ({ token, myPoos, phone, myFriends }) => async dispatch => {
  let dbMyPoos = [];
  let dbMyFriends = [];
  //async await
  try {
    await firebase.auth().signInWithCustomToken(token);

    console.log('token');
    console.log(token);

    console.log('phone');
    console.log(phone);

    await firebase.database().ref(`/users/${phone}`)
      .once('value', snapshot => {
        dbMyPoos = snapshot.val().myPoos ? snapshot.val().myPoos : [];
        dbMyFriends = snapshot.val().myFriends ? snapshot.val().myFriends : [];
      });

    dbMyPoos = typeof dbMyPoos === 'object' ? _.values(dbMyPoos) : dbMyPoos;
    dbMyFriends = typeof dbMyFriends === 'object' ? _.values(dbMyFriends) : dbMyFriends;


    const combinedAndReducedPoos = combineAndDeleteDuplicates(dbMyPoos, myPoos);
    const combinedAndReducedFriends = combineAndDeleteDuplicates(dbMyFriends, myFriends);

    firebase.database().ref(`/users/${phone}`)
      .update({ myPoos: combinedAndReducedPoos, myFriends: combinedAndReducedFriends });

    console.log('success');

    dispatch({
      type: LOGIN_SUCCESS,
      payload: token
    });

    dispatch({
      type: EDIT_POOS,
      payload: combinedAndReducedPoos
    });

    dispatch({
      type: SET_FRIENDS,
      payload: combinedAndReducedFriends
    });
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

// const convertStringToDatetime = (inputPoos) => {
//   return inputPoos.map(poo => {
//     const newPoo = poo;
//     console.log('newPoo');
//     console.log(newPoo);
//     console.log('typeof newPoo.datetime')
//     console.log(typeof newPoo.datetime)
//     let newDatetime = newPoo.datetime;
//
//     if (typeof newPoo.datetime === 'string') {
//       console.log('its a string');
//       newDatetime = moment(newPoo.datetime);
//     }


    // const newDatetime = typeof newPoo.datetime === 'string'
    //   ? moment(newPoo.datetime)
    //   : newPoo.datetime;

//     console.log("newDatetime");
//     console.log(newDatetime);
//
//     console.log('typeof newDatetime')
//     console.log(typeof newDatetime)
//
//     newPoo.datetime = newDatetime;
//     return newPoo;
//   });
// };
//
// const convertDatetimeToString = (inputPoos) => {
//   return inputPoos.map(poo => {
//     const newPoo = poo;
//
//     if (typeof newPoo.datetime === 'object') {
//       const date = newPoo.datetime.format('YYYY-MM-DD');
//       const newTime = newPoo.datetime.format('HH:mm');
//       const newDatetime = `${date}T${newTime}`;
//       newPoo.datetime = newDatetime;
//     }
//
//     return newPoo;
//   });
// };

const combineAndDeleteDuplicates = (array1, array2) => {
  const combinedArray = array1.concat(array2);

  return _.uniqWith(combinedArray, _.isEqual);
};
