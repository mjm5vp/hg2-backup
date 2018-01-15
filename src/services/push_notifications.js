import firebase from 'firebase';
import { Notifications, Permissions } from 'expo';
import Expo from 'expo-server-sdk';

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
  try {
    firebase.database().ref(`users/${currentUser.uid}/notifications`)
      .set({ token });
  } catch (err) {
    console.log(err);
    console.log('could not save notification token');
  }
};

export const sendNotification = () => {
  // Create a new Expo SDK client
  const expo = new Expo();

  // Create the messages that you want to send to clents
  const messages = [{
    to: 'ExponentPushToken[YcZt7NIlw_Sidh4EsdsOYC]',
    sound: 'default',
    body: 'This is a test notification',
    data: { withSome: 'data' },
  }];

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages);

  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.log('send notification error');
        console.error(error);
      }
    }
  })();
};
