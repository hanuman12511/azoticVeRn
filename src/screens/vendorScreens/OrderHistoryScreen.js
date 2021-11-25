import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  AppState,
  TouchableOpacity,
  Text,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Styles
import basicStyles from '../../styles/BasicStyles';
// Delegates
import {
  isAppOpenedByRemoteNotificationWhenAppClosed,
  resetIsAppOpenedByRemoteNotificationWhenAppClosed,
} from '../../firebase_api/FirebaseAPI';

// References
export let homeScreenFetchNotificationCount = null;

// Firebase API
import {checkPermission} from '../../firebase_api/FirebaseAPI';
// Components
import HeaderComponent from '../../screens/vendorScreens/VendorComponent/HeaderComponent';

// Tabs
// import NewOrderTab from '../vendorScreens/VenderHomeTabs/NewOrderTab';
import OrderHistoryTab from '../vendorScreens/VenderHomeTabs/OrderHistoryTab';
import CancleOrderTab from '../vendorScreens/VenderHomeTabs/CancleOrderTab';

export default class VendorHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      tabActive: 'Completed',
      appState: AppState.currentState,
    };
  }
  componentDidMount = async () => {
    // await uploadToken();

    await checkPermission();
    // navigating to Notification screen
    if (isAppOpenedByRemoteNotificationWhenAppClosed) {
      resetIsAppOpenedByRemoteNotificationWhenAppClosed();
      this.props.navigation.navigate('Notification');
      return;
    }

    homeScreenFetchNotificationCount = this.fetchNotificationCount;
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  componentWillUnmount() {
    clearTimeout(this.intervalID);
    //setInterval(this.getNameForAccount, 5000);

    homeScreenFetchNotificationCount = null;
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async (nextAppState) => {
    try {
      const {appState} = this.state;
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        await this.fetchNotificationCount();
      }

      this.setState({appState: nextAppState, isListRefreshing: false});
    } catch (error) {
      console.log(error.message);
    }
  };

  renderSlots = () => {
    const {tabActive} = this.state;
    if (tabActive === 'Completed') {
      return <OrderHistoryTab navigation={this.props.navigation} />;
    } else if (tabActive === 'Cancelled') {
      return <CancleOrderTab navigation={this.props.navigation} />;
    }
  };

  handleCompleted = () => {
    this.setState({tabActive: 'Completed'});
  };
  handleCancelled = () => {
    this.setState({tabActive: 'Cancelled'});
  };

  render() {
    const {tabActive} = this.state;
    // if (isLoading) {
    //   return <CustomLoader />;
    // }

    const activeStyle = [styles.tabBarIndicator, {backgroundColor: '#f57c00'}];
    const tabActiveText = [
      styles.tabBarLabel,
      {color: '#333', fontWeight: '700'},
    ];
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={basicStyles.mainContainer}>
          <HeaderComponent
            headerTitle="Order History"
            nav={this.props.navigation}
          />
          {/* <TabView
            initialLayout={initialLayout}
            navigationState={tabView}
            renderScene={sceneMap}
            onIndexChange={handleTabIndexChange}
            renderTabBar={this.renderTabBar}
          /> */}

          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={this.handleCompleted}
              style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Completed' ? tabActiveText : styles.tabBarLabel
                }>
                Completed
              </Text>
              <View
                style={
                  tabActive === 'Completed'
                    ? activeStyle
                    : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handleCancelled}
              style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Cancelled' ? tabActiveText : styles.tabBarLabel
                }>
                Cancelled
              </Text>
              <View
                style={
                  tabActive === 'Cancelled'
                    ? activeStyle
                    : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>
          </View>

          {this.renderSlots()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeHeader: {
    height: hp(6),
    backgroundColor: '#f2f1f1',
    // borderBottomWidth: 1,
    // borderBottomColor: '#f2f1f1',
    // elevation: 5,
  },
  headerLogo: {
    width: hp(8),
    aspectRatio: 2 / 1,
  },
  cart_icon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },
  mailContainer: {
    flex: 1,
  },
  tabBarStyle: {
    // marginBottom: hp(2),
    backgroundColor: '#fff',
    padding: 0,
    elevation: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: 'transparent',
    // marginHorizontal: wp(2),
    // borderBottomRightRadius: wp(2),
    // borderBottomLeftRadius: wp(2),
  },

  // tabBarIndicator: {
  //   backgroundColor: '#f6416c',
  //   padding: 0,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   // height: '100%',
  //   // borderBottomRightRadius: wp(2),
  //   // borderBottomLeftRadius: wp(2),
  // },

  tabContainer: {
    backgroundColor: '#fff',
    elevation: 0,
    flexDirection: 'row',
    borderBottomWidth: 4,
    borderBottomColor: '#f2f1f1',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabStyle: {
    flex: 1,
    alignItems: 'center',
    // height: '100%',
    justifyContent: 'center',
    zIndex: 7,
    height: hp(6),
  },
  tabBarLabel: {
    color: '#999',
    fontSize: wp(4),
    textTransform: 'capitalize',
    textAlign: 'center',
    flex: 1,
    // marginBottom: hp(-1.8),
    textAlignVertical: 'center',
  },
  tabBarIndicator: {
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 1,
    // alignSelf: 'center',
    borderRadius: 2.5,
    // marginLeft: wp(12.2),
  },
});
