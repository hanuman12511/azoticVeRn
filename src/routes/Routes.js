import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_home_black from '../assets/icons/ic_home_black.png';

import ic_profile_logout from '../assets/icons/ic_profile_logout.png';

// Venders Screens *****

import VendorSignUp from '../screens/VendorSignUpScreen';
import VendorLoginScreen from '../screens/VendorLoginScreen';
import VendorOtp from '../screens/VendorOtpScreen';

// Vendor Home
import VendorHomeScreen from '../screens/vendorScreens/VendorHomeScreen';
import VendorNewOrderDetailScreen from '../screens/vendorScreens/VendorNewOrderDetailScreen';
import VendorToCompleteDetailScreen from '../screens/vendorScreens/VendorToCompleteDetailScreen';
import OrderHistoryDetailScreen from '../screens/vendorScreens/OrderHistoryDetailScreen';
import CancleOrderTab from '../screens/vendorScreens/VenderHomeTabs/CancleOrderTab';
import OrderHistoryTab from '../screens/vendorScreens/VenderHomeTabs/OrderHistoryTab';

// Vendor Profile Screens
import VendorProfileScreen from '../screens/vendorScreens/VendorProfileScreen';
import AddProduct from '../screens/vendorScreens/AddProduct/AddProduct';
import UpdateProfileBackGroundImage from '../screens/vendorScreens/UpdateProfileBackGroundImage';
import VendorMenuDetailScreen from '../screens/vendorScreens/VendorMenuDetailScreen';
import AddMenuItemsScreen from '../screens/vendorScreens/AddMenuItemsScreen';
import AddMenuItemsScreenStep2 from '../screens/vendorScreens/AddMenuItemsScreenStep2';
import EditMenuItemsScreen from '../screens/vendorScreens/EditProduct/EditMenuItemsScreen';
import EditMenuItemsScreenStep2 from '../screens/vendorScreens/EditProduct/EditMenuItemsScreenStep2';
import EditProduct from '../screens/vendorScreens/EditProduct/EditProduct';
import VendorGalleryDetailScreen from '../screens/vendorScreens/VendorComponent/VendorGalleryDetailScreen';
import VendorCommentScreen from '../screens/vendorScreens/VendorComponent/VendorCommentScreen';

// Vendor Financial Screens
import FinancialScreen from '../screens/vendorScreens/FinancialScreen';
import TotalEarningScreen from '../screens/vendorScreens/TotalEarningScreen';
import AccountDetailScreen from '../screens/vendorScreens/AccountDetailScreen';
import EditAccountDetail from '../screens/vendorScreens/EditAccountDetail';
import PayOutScheduleScreen from '../screens/vendorScreens/PayOutScheduleScreen';
import TotalExpenditureScreen from '../screens/vendorScreens/TotalExpenditureScreen';

//Camera Component
import AddPostScreen from '../screens/vendorScreens/VendorComponent/AddPostScreen';
import AddStoryScreen from '../screens/vendorScreens/VendorComponent/AddStoryScreen';

//Comments
import AddCommentScreen from '../screens/AddCommentScreen';

//Farm Slot manager
import SlotManager from '../screens/SlotManager';
import SlotManaging from '../screens/SlotManaging';

//Driver Screen
import DriverHomeScreen from '../screens/DriverScreen/DriverHomeScreen';
import DriverNewOrder from '../screens/DriverScreen/DriverNewOrder';
import DriverDelivery from '../screens/DriverScreen/DriverDelivery';
// import DriverCancelOrder from '../screens/DriverScreen/DriverCancelOrder';
import OrderMap from '../screens/DriverScreen/OrderMap';

// Order History
import OrderHistoryScreen from '../screens/vendorScreens/OrderHistoryScreen';

// Service Area
import ServiceAreaScreen from '../screens/ServiceAreaScreen';
import ServiceArea2 from '../screens/ServiceArea2';

// Venders OrderComplete
// import OrderComplete from '../screens/vendorScreens/OrederComplete/OrderComplete';
// import OrderCompleteDetails from '../screens/vendorScreens/OrederComplete/OrderCompleteDetails';
// import OrderCompleteTracking from '../screens/vendorScreens/OrederComplete/OrderCompleteTracking';

import NotificationScreen from '../screens/NotificationScreen';

// User Preference
import {clearData, KEYS, getData, storeData} from '../api/UserPreference';
import basicStyles from '../styles/BasicStyles';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showToast} from '../components/CustomToast';
import SwitchToggle from 'react-native-switch-toggle';

const styles = StyleSheet.create({
  drawerContentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerItemIcon: {
    height: wp(4),
    aspectRatio: 1 / 1,
  },
  drawerHeader: {
    backgroundColor: '#fff',
    paddingVertical: hp(3),
    paddingHorizontal: wp(3),
    alignItems: 'flex-start',
    // borderBottomWidth: 1,
    // borderBottomColor: '#444',
  },
  headerLogo: {
    // marginLeft: wp(5),
    height: hp(12),
    aspectRatio: 1 / 1,
    borderRadius: hp(6),
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  phoneNo: {
    marginLeft: wp(5),
  },

  drawerLabel: {
    fontSize: wp(4),
    fontWeight: '400',
  },

  profileImage: {
    height: hp(15),
    aspectRatio: 1 / 1,
    margin: wp(2),
    alignSelf: 'center',
  },
  logoffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp(3),
    borderTopWidth: 4,
    borderTopColor: '#f5f5f5',
  },
  Name: {
    fontSize: wp(4.5),
    color: '#444',
    fontWeight: '700',
    marginTop: wp(2),
    marginBottom: wp(2),
  },
  Address: {
    fontSize: wp(3.5),
    color: '#666',
    fontWeight: '400',
    // marginBottom: wp(3),
  },
  switchButton: {
    width: wp(9.4),
    height: hp(2.2),
    borderRadius: 25,
    marginLeft: wp(1),
  },
  switchCircle: {
    width: wp(5.2),
    height: wp(5.2),
    borderRadius: wp(10.2),
  },
});

const setDrawerItemIcon = (itemIcon) => ({
  drawerIcon: (
    <Image source={itemIcon} resizeMode="cover" style={styles.drawerItemIcon} />
  ),
});

const drawerContentContainerInset = {
  top: 'always',
  horizontal: 'never',
};

let loggedInUserInfo = null;
const VendorDrawerContentComponent = (props) => {
  const info = props.navigation.getParam('info', null);

  const {
    role = '',
    vendorName = 'User',
    vendorImage = null,
    vendorAddress = '',
    vendorStatus = false,
  } = info || loggedInUserInfo || {};

  let [isEnabled, setIsEnabled] = useState(vendorStatus);
  const toggleSwitch = async () => {
    isEnabled = !isEnabled;

    await setIsEnabled(isEnabled);

    await handleVendorOnline();
  };

  const handleVendorOnline = async () => {
    try {
      // starting loader

      let status = isEnabled ? 1 : 0;

      const params = {
        status,
      };

      // calling api

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/updateLogOff',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success} = response;

        let userInfo = await getData(KEYS.USER_INFO);

        userInfo.vendorStatus = isEnabled;

        if (success) {
          const {message} = response;
          await storeData(KEYS.USER_INFO, userInfo);
          showToast(message);
        } else {
          const {message} = response;
          showToast(message);
        }
        // }
      } else {
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={basicStyles.flexOne}>
      <SafeAreaView
        style={styles.drawerContentContainer}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={styles.drawerHeader}>
          <Image
            source={{uri: vendorImage}}
            resizeMode="cover"
            style={styles.headerLogo}
          />
          <Text style={styles.Name}>{vendorName}</Text>
          <Text style={styles.Address}>{vendorAddress}</Text>
        </View>
        <View style={basicStyles.flexOne}>
          <DrawerItems
            {...props}
            onItemPress={onDrawerItemPress(props)}
            labelStyle={styles.drawerLabel}
            activeTintColor="#F57C00"
            inactiveTintColor="#666"
            activeBackgroundColor="#FEF2E5"
          />
        </View>
        <View>
          <View style={styles.logoffContainer}>
            <Text>Log off</Text>
            <SwitchToggle
              switchOn={isEnabled}
              onPress={toggleSwitch}
              circleColorOff="#6D6D6D"
              circleColorOn="#f57c00"
              backgroundColorOn="#C4C4C4"
              backgroundColorOff="#C4C4C4"
              containerStyle={styles.switchButton}
              circleStyle={styles.switchCircle}
            />
          </View>

          <TouchableOpacity
            style={styles.logoffContainer}
            onPress={handleLogout(props)}>
            <Text style={styles.Name}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const DriverDrawerContentComponent = (props) => {
  const info = props.navigation.getParam('info', null);

  const {
    role = '',
    vendorName = 'User',
    vendorImage = null,
    vendorAddress = '',
    vendorStatus = false,
  } = info || loggedInUserInfo || {};

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={basicStyles.flexOne}>
      <SafeAreaView
        style={styles.drawerContentContainer}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={styles.drawerHeader}>
          <Image
            source={{uri: vendorImage}}
            resizeMode="cover"
            style={styles.headerLogo}
          />
          <Text style={styles.Name}>{vendorName}</Text>
          <Text style={styles.Address}>{vendorAddress}</Text>
        </View>
        <View style={basicStyles.flexOne}>
          <DrawerItems
            {...props}
            onItemPress={onDrawerItemsPress(props)}
            labelStyle={styles.drawerLabel}
            activeTintColor="#F57C00"
            inactiveTintColor="#666"
            activeBackgroundColor="#FEF2E5"
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const onLogoutYesPress = (navigation) => async () => {
  try {
    // Clearing user preferences from local storage
    await clearData();

    // Resetting Navigation to initial state for login again
    navigation.navigate('VendorLoggedOut');
  } catch (error) {
    console.log(error.message);
  }
};

const onDrawerItemPress = (props) => (route) => {
  if (route.route.routeName !== 'Logout') {
    props.onItemPress(route);
    return;
  }
  // If 'Logout' route pressed
  handleLogout();
};

const onDrawerItemsPress = (props) => (route) => {
  if (route.route.routeName !== 'Logout') {
    props.onItemPress(route);
    return;
  }
  // If 'Logout' route pressed
  props.navigation.closeDrawer();

  Alert.alert(
    'Logout',
    'Are you sure, you want to logout?',
    [
      {text: 'NO', style: 'cancel'},
      {text: 'YES', onPress: onLogoutYesPress(props.navigation)},
    ],
    {
      cancelable: false,
    },
  );
};

const handleLogout = (props) => () => {
  props.navigation.closeDrawer();

  Alert.alert(
    'Logout',
    'Are you sure, you want to logout?',
    [
      {text: 'NO', style: 'cancel'},
      {text: 'YES', onPress: onLogoutYesPress(props.navigation)},
    ],
    {
      cancelable: false,
    },
  );
};

const VendorLoggedOutNavigator = createStackNavigator(
  {
    VendorLogin: VendorLoginScreen,
    VendorReg: VendorSignUp,
    VendorOtp: VendorOtp,
  },
  {
    initialRouteName: 'VendorLogin',
    headerMode: 'none',
  },
);

const CompleteOrderNavigator = createStackNavigator(
  {
    VendorHome: VendorHomeScreen,
    orderHistory: OrderHistoryTab,
    cancelOrder: CancleOrderTab,
    VendorNewOrderDetail: VendorNewOrderDetailScreen,
    VendorToCompleteDetail: VendorToCompleteDetailScreen,
    OrderHistoryDetail: OrderHistoryDetailScreen,
    Notification: NotificationScreen,
  },
  {
    initialRouteName: 'VendorHome',
    headerMode: 'none',
  },
);

const OrderHistoryNavigator = createStackNavigator(
  {
    OrderHistory: OrderHistoryScreen,
    OrderHistoryDetail: OrderHistoryDetailScreen,
  },
  {
    initialRouteName: 'OrderHistory',
    headerMode: 'none',
  },
);

const VendorProfileNavigator = createStackNavigator(
  {
    VendorProfile: VendorProfileScreen,
    UpdatePopup: UpdateProfileBackGroundImage,
    Comments: AddCommentScreen,
    CameraComponent: AddPostScreen,
    // AddPostScreen: AddPostScreen,
    AddStory: AddStoryScreen,
    AddMenuItems: AddMenuItemsScreen,
    AddMenuItemsStep2: AddMenuItemsScreenStep2,
    AddProduct: AddProduct,
    VendorMenuDetail: VendorMenuDetailScreen,
    EditMenuItems: EditMenuItemsScreen,
    EditMenuItemsStep2: EditMenuItemsScreenStep2,
    EditProduct: EditProduct,
    VendorGalleryDetail: VendorGalleryDetailScreen,
    VendorComment: VendorCommentScreen,
  },
  {
    initialRouteName: 'VendorProfile',
    headerMode: 'none',
  },
);

const FinancialNavigator = createStackNavigator(
  {
    Financial: FinancialScreen,
    TotalEarning: TotalEarningScreen,
    AccountDetail: AccountDetailScreen,
    EditAccount: EditAccountDetail,
    PayOutSchedule: PayOutScheduleScreen,
    TotalExpenditure: TotalExpenditureScreen,
  },
  {
    initialRouteName: 'Financial',
    headerMode: 'none',
  },
);

const DriverNavigator = createStackNavigator(
  {
    DriverHome: DriverHomeScreen,
    OrderMap: OrderMap,
  },
  {
    initialRouteName: 'DriverHome',
    headerMode: 'none',
  },
);

const DriverLoginNavigator = createStackNavigator(
  {
    DriverHome: DriverHomeScreen,
    OrderMap: OrderMap,
  },
  {
    initialRouteName: 'DriverHome',
    headerMode: 'none',
  },
);

const DriverLoginNavigators = createDrawerNavigator(
  {
    DriverHome: {
      screen: DriverNavigator,
      navigationOptions: setDrawerItemIcon(ic_home_black),
    },
    // Map: {
    //   screen: OrderMap,
    //   navigationOptions: setDrawerItemIcon(ic_google),
    // },
    Logout: {
      screen: 'No Screen',
      navigationOptions: setDrawerItemIcon(ic_profile_logout),
    },
  },

  {
    initialRouteName: 'DriverHome',
    unmountInactiveRoutes: true,
    contentComponent: DriverDrawerContentComponent,
  },
);

const VendorLoggedInNavigator = createDrawerNavigator(
  {
    'Current Orders': {
      screen: CompleteOrderNavigator,
    },

    'Order History': {
      screen: OrderHistoryNavigator,
    },

    // 'Slot Manager': {
    //   screen: ServiceArea2,
    // },
    // 'Slot Managing': {
    //   screen: SlotManaging,
    // },
    'Service Area': {
      screen: ServiceAreaScreen,
    },

    'Vendor Profile': {
      screen: VendorProfileNavigator,
    },

    Financial: {
      screen: FinancialNavigator,
    },
  },
  {
    initialRouteName: 'Current Orders',
    unmountInactiveRoutes: true,
    contentComponent: VendorDrawerContentComponent,
  },
);

export const createRootNavigator = (userInfo) => {
  loggedInUserInfo = userInfo;

  const ROUTES = {
    VendorLoggedOut: VendorLoggedOutNavigator,
    VendorLoggedIn: VendorLoggedInNavigator,
    DriverLogin: DriverLoginNavigator,
  };

  let initialRouteName = 'VendorLoggedOut';

  if (userInfo) {
    const {role} = userInfo;

    if (role) {
      if (role === 'vendor') {
        initialRouteName = 'VendorLoggedIn';
      } else if (role === 'driver') {
        initialRouteName = 'DriverLogin';
      }
      // } else {
      //   initialRouteName = 'LoggedIn';
    }
  }

  return createSwitchNavigator(ROUTES, {initialRouteName});
};
