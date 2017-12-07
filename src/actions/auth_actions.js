import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import _ from 'lodash';
import { LOGIN_SUCCESS, LOGIN_FAIL, EDIT_POOS, EDIT_MY_INFO } from './types';

export const editMyInfo = ({ name, number }) => {
  firebase.database().ref(`users/${number}/myInfo`)
    .set({ name, number });

  return {
    type: EDIT_MY_INFO,
    payload: { name, number }
  };
};

export const authLogin = ({ data, myPoos, phone }) => async dispatch => {
  let dbMyPoos = [];
  //async await
  try {
    await firebase.auth().signInWithCustomToken(data.token);

    await firebase.database().ref(`/users/${phone}/myPoos`)
      .once('value', snapshot => {
        dbMyPoos = snapshot.val() ? snapshot.val() : [];
      });

    dbMyPoos = typeof dbMyPoos === 'object' ? _.values(dbMyPoos) : dbMyPoos;

    const combinedAndReducedPoos = combineAndDeleteDuplicates({ dbMyPoos, myPoos });

    firebase.database().ref(`/users/${phone}`)
      .update({ myPoos: combinedAndReducedPoos });

    console.log('success');

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token
    });

    dispatch({
      type: EDIT_POOS,
      payload: combinedAndReducedPoos
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

const combineAndDeleteDuplicates = ({ dbMyPoos, myPoos }) => {
  const combinedPoos = dbMyPoos.concat(myPoos);

  return _.uniqWith(combinedPoos, _.isEqual);
};
