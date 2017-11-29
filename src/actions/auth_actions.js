import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { LOGIN_SUCCESS, LOGIN_FAIL, EDIT_POOS } from './types';

const ROOT_URL = 'https://us-central1-one-time-password-698fc.cloudfunctions.net';

export const authLogin = ({ myPoos, phone, code }) => async dispatch => {
  var dbMyPoos = [];
  //async await
  try {
    const { data } = await axios.post(`${ROOT_URL}/verifyOneTimePassword`, { phone, code });
    await firebase.auth().signInWithCustomToken(data.token);

    await firebase.database().ref(`/users/${phone}/myPoos`)
    .once('value', snapshot => {
      dbMyPoos = snapshot.val() ? snapshot.val() : [];
    });

    dbMyPoos = typeof dbMyPoos === 'object' ? _.values(dbMyPoos) : dbMyPoos;

    // const combinedAndReducedPoos = combineAndDeleteDuplicates({ dbMyPoos, myPoos });

    const newReducerPoos = convertStringToDatetime(myPoos);
    const newDbPoos = convertDatetimeToString(myPoos);

    // firebase.database().ref(`/users/${phone}`)
    //   .update({ myPoos: newDbPoos });

    console.log('success');

    // dispatch({
    //   type: EDIT_POOS,
    //   payload: newReducerPoos
    // });

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token
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

const convertStringToDatetime = (inputPoos) => {
  return inputPoos.map(poo => {
    const newPoo = poo;
    console.log('newPoo');
    console.log(newPoo);
    console.log('typeof newPoo.datetime')
    console.log(typeof newPoo.datetime)
    let newDatetime = newPoo.datetime;

    if (typeof newPoo.datetime === 'string') {
      console.log('its a string');
      newDatetime = moment(newPoo.datetime);
    }


    // const newDatetime = typeof newPoo.datetime === 'string'
    //   ? moment(newPoo.datetime)
    //   : newPoo.datetime;

    console.log("newDatetime");
    console.log(newDatetime);

    console.log('typeof newDatetime')
    console.log(typeof newDatetime)

    newPoo.datetime = newDatetime;
    return newPoo;
  });
};

const convertDatetimeToString = (inputPoos) => {
  return inputPoos.map(poo => {
    const newPoo = poo;

    if (typeof newPoo.datetime === 'object') {
      const date = newPoo.datetime.format('YYYY-MM-DD');
      const newTime = newPoo.datetime.format('HH:mm');
      const newDatetime = `${date}T${newTime}`;
      newPoo.datetime = newDatetime;
    }

    return newPoo;
  });
};

const combineAndDeleteDuplicates = ({ dbMyPoos, myPoos }) => {
  const combinedPoos = dbMyPoos.concat(myPoos);

  return _.uniqWith(combinedPoos, _.isEqual);
};
