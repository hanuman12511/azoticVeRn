import React, {PureComponent} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

// Icons
import ic_back_black from '../assets/icons/ic_back_black.png';
import ic_profile_logout from '../assets/icons/ic_profile_logout.png';
import ic_cart from '../assets/icons/ic_cart.png';
import ic_menu from '../assets/icons/ic_menu.png';
import ic_home_black from '../assets/icons/ic_home_black.png';
import {clearData} from '../../../api/UserPreference';

export default class HeaderComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cartItemCount: 0,
      currentLocation: 'Change Location',
      visible: true,
    };
  }

  toggleDrawer = () => {
    this.props.nav.openDrawer();
  };

  handleBack = () => {
    const {headerTitle, nav} = this.props;

    nav.pop();
  };

  confirmLogout = () => {
    Alert.alert('Logout !', 'Do you want to logout! \nPress LOGOUT', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: this.handleLogout,
      },
    ]);
  };

  handleLogout = async () => {
    await clearData();
    this.props.nav.navigate('VendorLogin');
  };

  handleNotification = () => {
    this.props.nav.navigate('Notification');
  };

  handleCart = () => {
    this.props.nav.navigate('My Cart');
  };

  handleAllCategory = () => {
    this.props.nav.push('AllCategory');
  };

  handleSearch = () => {
    this.props.nav.push('SearchProduct');
  };

  selectAddressCallback = (formatted_address) => {
    this.setState({currentLocation: formatted_address});
  };

  handleCurrentLoc = () => {
    const navParams = {selectAddressCallback: this.selectAddressCallback};
    this.props.nav.push('CurrentLocation', navParams);
  };

  render() {
    const {
      headerTitle,
      navAction,
      showLocationPicker,
      showNotificationIcon,
      notificationCount,
      showCartIcon,
      isDriver,
    } = this.props;

    let handleNavAction = this.toggleDrawer;
    let navIcon = ic_menu;
    if (navAction === 'back') {
      handleNavAction = this.handleBack;
      navIcon = ic_back_black;
    }

    const showNotificationBadge = notificationCount > 0;
    const isNotificationCountUpToTwoDigit = notificationCount < 100;

    const {cartItemCount} = this.state;
    const showCartBadge = cartItemCount > 0;
    const isCartCountTwoDigit = cartItemCount < 100;

    const numLines = 1;

    return (
      <View style={styles.headerContainer}>
        {isDriver ? (
          <View>
            <Image
              source={ic_home_black}
              resizeMode="cover"
              style={styles.menuIcon}
            />
          </View>
        ) : (
          <TouchableOpacity
            underlayColor="transparent"
            onPress={handleNavAction}>
            <Image
              source={navIcon}
              resizeMode="cover"
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>{headerTitle}</Text>

        {showNotificationIcon && (
          <TouchableOpacity
            style={styles.notificationIconContainer}
            onPress={this.handleNotification}>
            <FontAwesome
              name="bell-o"
              size={24}
              color="#666"
              style={styles.checkIcon}
            />

            {showNotificationBadge && (
              <View style={styles.notificationBadgeContainer}>
                {isNotificationCountUpToTwoDigit ? (
                  <Text style={styles.notificationBadge}>
                    {notificationCount}
                  </Text>
                ) : (
                  <Text style={styles.notificationBadge}>99+</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        )}

        {showCartIcon && (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.handleCart}>
            <View>
              <Image
                source={ic_cart}
                resizeMode="cover"
                style={styles.cartIcon}
              />

              {showCartBadge && (
                <View style={styles.cartBadgeContainer}>
                  {isCartCountTwoDigit ? (
                    <Text style={styles.cartBadge}>{cartItemCount}</Text>
                  ) : (
                    <Text style={styles.cartBadge}>99+</Text>
                  )}
                </View>
              )}
            </View>
          </TouchableHighlight>
        )}

        {isDriver && (
          <TouchableOpacity
            underlayColor="transparent"
            onPress={this.confirmLogout}>
            <View>
              <Image
                source={ic_profile_logout}
                resizeMode="cover"
                style={styles.cartIcon}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(3),
    height: hp(7),
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerBottomContainer: {
    flexDirection: 'row',
    // marginTop: wp(2),
    alignItems: 'center',
  },
  menuIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  cartIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  locationContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSubTitle: {
    fontSize: wp(2.2),
    color: '#333',
    marginTop: 3,
  },
  selectLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    // flex: 1,
    fontSize: wp(3),
    color: '#fff',
    marginBottom: 0,
  },
  editIcon: {
    // width: wp(3),
    // aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  headerTitle: {
    flex: 1,
    fontSize: wp(4),
    color: '#333',
    fontWeight: '700',
  },
  cartBadgeContainer: {
    width: wp(3.3),
    height: wp(3.3),
    backgroundColor: '#2bb256',
    borderRadius: wp(1.7),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: 0,
  },
  cartBadge: {
    color: '#fff',
    fontSize: wp(2),
    textAlign: 'center',
  },
  categoryButton: {
    backgroundColor: '#fff',
    height: hp(5.5),
    width: wp(20),
    borderRadius: 4,
    marginRight: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  allCategory: {
    color: '#333',
    fontSize: wp(3),
  },
  searchContainer: {
    flex: 1,
    height: hp(5.5),
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: wp(2),
  },
  searchLabel: {
    color: '#333',
    fontSize: wp(3),
  },
  notificationIconContainer: {
    // marginLeft: 'auto',
  },
  // notificationIcon: {
  //   width: wp(5.6),
  //   height: wp(5.6),
  // },
  notificationBadgeContainer: {
    height: wp(3.3),
    paddingHorizontal: 3,
    backgroundColor: 'red',
    borderRadius: wp(1.7),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: wp(2),
    left: wp(2),
  },
  notificationBadge: {
    flex: 1,
    color: '#fff',
    fontSize: wp(2.2),
    textAlign: 'center',
  },
  checkIcon: {
    marginRight: wp(3),
  },
});
