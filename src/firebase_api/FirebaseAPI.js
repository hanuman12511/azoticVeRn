import {Platform} from 'react-native';
import {nsNavigate} from '../routes/NavigationService';

// API
import firebase from 'react-native-firebase';
import uploadToken from './UploadTokenAPI';

// Delegates
import {homeScreenFetchNotificationCount} from '../screens/vendorScreens/VendorHomeScreen';

// References
export let isAppOpenedByRemoteNotificationWhenAppClosed = false;

// Android Notification Channel for Local Notifications
const createAndroidNotificationChannel = () => {
  try {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel(
      'agzoticVendor',
      'agzoticVendor channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('agzoticVendor app channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
  } catch (error) {
    console.log(error.message);
  }
};

export const checkPermission = async () => {
  try {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      // setting up android notification channel
      if (Platform.OS === 'android') {
        createAndroidNotificationChannel();
      }

      // fetching fcm token
      await getToken();
    } else {
      await requestPermission();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const requestPermission = async () => {
  try {
    // requesting permission
    await firebase.messaging().requestPermission();

    // User has authorized:
    // setting up android notification channel
    if (Platform.OS === 'android') {
      createAndroidNotificationChannel();
    }

    // fetching fcm token
    await getToken();
  } catch (error) {
    // User has rejected permission
    console.log(error.message);
  }
};

const getToken = async () => {
  try {
    const fcmToken = await firebase.messaging().getToken();

    if (fcmToken) {
      // calling api to upload token
      const response = await uploadToken(fcmToken);

      // calling api again in case of failure
      if (response && response.success !== 1) {
        await uploadToken(fcmToken);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Token Listeners
const onTokenRefreshCallback = async fcmToken => {
  try {
    if (fcmToken) {
      // calling api to update token
      const response = await uploadToken(fcmToken);

      // calling api again in case of failure
      if (response && response.success !== 1) {
        await uploadToken(fcmToken);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const createOnTokenRefreshListener = thisArg => {
  thisArg.onTokenRefreshListener = firebase
    .messaging()
    .onTokenRefresh(onTokenRefreshCallback);
};

export const removeOnTokenRefreshListener = thisArg => {
  thisArg.onTokenRefreshListener();
};

// Notification Listeners
export const createNotificationListeners = async thisArg => {
  // Triggered when a particular notification has been received in foreground
  const onNotificationCallback = async notification => {
    // build the notification
    notification.setSound('default');

    if (Platform.OS === 'android') {
      notification.android
        .setAutoCancel(true)
        .android.setColor('#3d6cb5')
        .android.setSmallIcon('ic_notification')
        .android.setChannelId('vendor_bakery')
        .android.setPriority(firebase.notifications.Android.Priority.Max);
    }

    // display the notification
    firebase.notifications().displayNotification(notification);

    // updating notification count on home screen if it is focused
    if (homeScreenFetchNotificationCount) {
      await homeScreenFetchNotificationCount();
    }
  };

  thisArg.onNotificationListener = firebase
    .notifications()
    .onNotification(onNotificationCallback);

  // If your app is in background, you can listen for when a notification is clicked/tapped/opened
  thisArg.onNotificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(notificationObj => {
      nsNavigate('Notification');
    });

  // If your app is closed, you can check if it was opened by a notification being clicked/tapped/opened
  const initialNotification = await firebase
    .notifications()
    .getInitialNotification();

  if (initialNotification) {
    isAppOpenedByRemoteNotificationWhenAppClosed = true;
  }
};

export const removeNotificationListeners = thisArg => {
  // Remove listeners allocated in createNotificationListeners()
  thisArg.onNotificationListener();
  thisArg.onNotificationOpenedListener();
};

export const resetIsAppOpenedByRemoteNotificationWhenAppClosed = () => {
  isAppOpenedByRemoteNotificationWhenAppClosed = false;
};
