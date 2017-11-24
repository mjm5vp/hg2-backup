import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';
import firebase from 'firebase';
import { FACEBOOK_LOGIN_SUCCESS, FACEBOOK_LOGIN_FAIL } from './types';

export const facebookLogin = () => async dispatch => {
  // const token = await AsyncStorage.getItem('fb_token');

  // if (token) {
  //   // Dispatch an action saying FB login is done
  //   console.log('token already exists');
  //   dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
  // } else {
    // console.log('no facebook token');
    // Start up FB Login process
    doFacebookLogin(dispatch);
  // }
};

const doFacebookLogin = async dispatch => {
  const { type, token } = await Facebook.logInWithReadPermissionsAsync('528976100796092', {
    permissions: ['public_profile']
  });

  if (type === 'cancel') {
    return dispatch({ type: FACEBOOK_LOGIN_FAIL });
  }

  if (type === 'success') {
    // Build Firebase credential with the Facebook access token.
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    firebase.auth().signInWithCredential(credential).catch((error) => {
      // Handle Errors here.
      console.log('error: signInWithCredential');
      console.log(error);
  });
}

  await AsyncStorage.setItem('fb_token', token);
  dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: token });
};

export const facebookLogout = () => {
  console.log('facebookLogout action');
  firebase.auth().signOut();
  AsyncStorage.setItem('fb_token', '');
  return { type: FACEBOOK_LOGIN_FAIL };
};
