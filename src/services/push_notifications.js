import firebase from 'firebase';
import { Notifications, Permissions } from 'expo';
// import Expo from 'expo-server-sdk';

export const registerForPushNotificationsAsync = async () => {
  const { currentUser } = firebase.auth();

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  const token = await Notifications.getExpoPushTokenAsync();
  console.log('notification token');
  console.log(token);

  // POST the token to your backend server from where you
  // can retrieve it to send push notifications.
  // try {
  //   await firebase.database().ref(`users/${currentUser.uid}/notifications`)
  //     .set({ token });
  // } catch (err) {
  //   console.log(err);
  //   console.log('could not save notification token');
  // }

  return token;
};

export const registerForRemoteNotifications = async () => {
  const previousToken = await AsyncStorage.getItem('pushtoken');
  console.log(previousToken);
  if (previousToken) {
    return;
  } else {
    let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

    if (status !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    await axios.post(PUSH_ENDPOINT, { token: { token } });
    AsyncStorage.setItem('pushtoken', token);
  }
};
