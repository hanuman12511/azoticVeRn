import React, {Component} from 'react';
import {LogBox} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import GlobalFont from 'react-native-global-font';
import {ModalPortal} from 'react-native-modals';

// Splash Screen
import SplashScreen from './src/screens/SplashScreen';

// User Preference
// import {KEYS, getData} from './src/api/UserPreference';

// Routes
import {createRootNavigator} from './src/routes/Routes';

// Routes
import {nsSetTopLevelNavigator} from './src/routes/NavigationService';

// UserPreference
import {KEYS, storeData, getData} from './src/api/UserPreference';

// // Firebase API
import {
  checkPermission,
  createOnTokenRefreshListener,
  removeOnTokenRefreshListener,
  createNotificationListeners,
  removeNotificationListeners,
} from './src/firebase_api/FirebaseAPI';

// // Upload Token
import uploadToken from './src/firebase_api/UploadTokenAPI';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userInfo: null,
    };
  }

  componentDidMount() {
    try {
      setTimeout(this.initialSetup, 2000);
      // Adding firebase listeners
      createOnTokenRefreshListener(this);
      createNotificationListeners(this);

      // let fontName = 'AbrilFatface-Regular';
      // GlobalFont.applyGlobal(fontName);
    } catch (error) {
      console.log(error.message);
    }
  }
  componentWillUnmount() {
    // Removing firebase listeners
    removeOnTokenRefreshListener(this);
    removeNotificationListeners(this);
  }
  initialSetup = async () => {
    try {
      await checkPermission();

      // await uploadToken();

      // Fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      // const isLoggedIn = userInfo ? true : false;

      this.setState({userInfo, isLoading: false});
    } catch (error) {
      console.log(error.message);
    }
  };

  setNavigatorRef = (ref) => {
    nsSetTopLevelNavigator(ref);
  };

  render() {
    const {isLoading, userInfo} = this.state;

    if (isLoading) {
      return <SplashScreen />;
    }

    const RootNavigator = createRootNavigator(userInfo);

    const AppContainer = createAppContainer(RootNavigator);

    return (
      <RootSiblingParent>
        <SafeAreaProvider>
          <AppContainer ref={this.setNavigatorRef} />
          <ModalPortal />
        </SafeAreaProvider>
      </RootSiblingParent>
    );
  }
}
