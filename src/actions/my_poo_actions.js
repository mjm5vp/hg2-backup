import firebase from 'firebase';
import { ADD_POO, EDIT_POOS, IDENTIFY_STACK_LOCATION, INCREASE_UID, SET_LOG_TYPE } from './types';

export const setLogType = (logType) => {
  return {
    type: SET_LOG_TYPE,
    payload: logType
  };
};

export const addPoo = ({ inputUID, currentPooName, datetime, description, location }) => {
  console.log('addPoo');
  const { currentUser } = firebase.auth();

  if (currentUser) {
    // console.log('added poo to database');
    // const stringDatetime = datetime.toString();
    // const stringDatetime = datetime.format('MMMM Do YYYY, h:mm a');
    // firebase.database().ref(`/users/${currentUser.uid}/myPoos/${inputUID}`)
    //   .update({ inputUID, currentPooName, datetime: stringDatetime, description, location });
      // .push({inputUID, currentPooName, stringDatetime, description, location });
  }

  return {
    type: ADD_POO,
    payload: { inputUID, currentPooName, datetime, description, location }
  };
};

export const editPoos = (newPoos) => {
  console.log('editPoos');
  return {
    type: EDIT_POOS,
    payload: newPoos
  };
};

export const identifyStackLocation = (location) => {
  console.log('identifyStackLocation');
  return {
    type: IDENTIFY_STACK_LOCATION,
    payload: location
  };
};

export const increaseUID = () => {
  console.log('increaseUID');
  return {
    type: INCREASE_UID,
    payload: null
  };
};
