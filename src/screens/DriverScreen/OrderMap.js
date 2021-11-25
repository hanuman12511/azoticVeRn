import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
  Button,
  Platform,
  Linking,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';
const {width, height} = Dimensions.get('window');
//Api's
import {getData, KEYS} from '../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
// Components
import HeaderComponent from '../../screens/vendorScreens/VendorComponent/HeaderComponent';
import CustomLoader from '../../components/DriverMap';

import animated_resta_pin from '../../assets/icons/animated_resta_pin.gif';
import animated_customer_pin from '../../assets/icons/animated_customer_pin.gif';

// Styles
import basicStyles from '../../styles/BasicStyles';
//Permissions
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
//vector icon
import Icon from 'react-native-vector-icons/MaterialIcons';
import Call from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

//DeliveryPopUp
import UpdatePopup from './DriverComponents/DeliveryPopUp';

//maps
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
import {regionFrom} from '../../helpers/location';
import {showToast} from '../../components/CustomToast';

const ASPECT_RATIO = width / height;

class OrderMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrders: [],
      status: '',
      isLoading: false,
      isListRefreshing: false,
      coordinates: [
        {latitude: 26.9519, longitude: 75.7781},
        {latitude: 26.95852, longitude: 75.78835},
      ],
      currentLocationAddress: null,
      isDefaultAddress: false,
      showQualityPopup: false,
    };

    // current location coordinates
    this.coords = null;
  }

  componentDidMount = async () => {
    try {
      // checking location permission
      this.checkPermission();
      this.fetchCurrentPosition();
    } catch (error) {
      console.log(error.message);
    }
  };
  closePopup = () => {
    this.setState({showQualityPopup: false});
  };
  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
            // this.handleGetDirections();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          // this.handleGetDirections();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Location" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };

  fetchCurrentPosition = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      showLocationDialog: true,
      forceRequestLocation: true,
    };

    Geolocation.getCurrentPosition(
      this.geolocationSuccessCallback,
      this.geolocationErrorCallback,
      options,
    );
  };

  geolocationSuccessCallback = async (position) => {
    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      // preparing info
      const API_KEY = 'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k';
      this.coords = position.coords;
      const {latitude, longitude} = this.coords;

      // calling api
      const response = await makeRequest(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
      );

      // processing response
      if (response) {
        const {status} = response;

        if (status === 'OK') {
          const {results} = response;

          // filtering addresses result(taking first address only)
          const filteredResult = results[0];
          const currentLocationAddress = filteredResult.formatted_address;

          this.setState({
            currentLocationAddress,
            showProcessingLoader: false,
          });
        } else {
          const {error_message} = response;
          console.log(error_message);

          this.setState({
            currentLocationAddress: null,
            showProcessingLoader: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  geolocationErrorCallback = (error) => {
    if (
      error.code === 2 &&
      error.message === 'No location provider available.'
    ) {
      Alert.alert(
        '',
        "Make sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    } else {
      console.log(error.code, error.message);

      Alert.alert(
        'Error',
        "Something went wrong...\nMake sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    }
  };

  handleGetDirections = () => {
    const item = this.props.navigation.getParam('item', null);
    const {
      orderId,
      customerLatitude,
      customerLongitude,
      vendorLatitude,
      vendorLongitude,
    } = item;
    const data = {
      source: {latitude: vendorLatitude, longitude: vendorLongitude},
      destination: {latitude: customerLatitude, longitude: customerLongitude},
      params: [
        {
          key: 'travelmode',
          value: 'driving', // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate', // this instantly initializes navigation using the given travel mode
        },
      ],
      waypoints: [
        {latitude: vendorLatitude, longitude: vendorLongitude},
        {
          latitude: customerLatitude,
          longitude: customerLongitude,
        },
      ],
    };

    getDirections(data);
  };

  handleCall = async () => {
    try {
      this.setState({isLoading: true});
      const item = this.props.navigation.getParam('item', null);
      const {orderId} = item;
      if (orderId) {
        const params = {orderId};
        const response = await makeRequest(
          BASE_URL + 'api/DeliveryBoys/callToCustomer',
          params,
          true,
          false,
        );
        if (response) {
          const {success, message} = response;
          this.setState({isLoading: false});
          if (success) {
            showToast(message);
            const {newProduct} = this.props;
            await newProduct();
          } else {
            showToast(message);
          }
        } else {
          console.log('Status Response Null From Api');
        }
      } else {
        console.log('response form order Id null');
      }
    } catch (error) {
      console.log('Accept Order Response Error', error);
    }
  };
  handleCheck = async () => {
    try {
      console.log('update press ===');
      this.setState({showQualityPopup: true});
    } catch (error) {}
    // try {
    //   this.setState({isLoading: true});
    //   const item = this.props.navigation.getParam('item', null);
    //   const {orderId} = item;
    //   if (orderId) {
    //     const params = {orderId, status: 'dispatched'};
    //     const response = await makeRequest(
    //       BASE_URL + 'api/Vendors/updateOrderStatus',
    //       params,
    //       true,
    //       false,
    //     );
    //     if (response) {
    //       const {success, message} = response;
    //       this.setState({isLoading: false});
    //       if (success) {
    //         console.log('order Success');
    //         showToast(message);
    //         const {newProduct} = this.props;
    //         await newProduct();
    //       } else {
    //         showToast(message);
    //       }
    //     } else {
    //       console.log('Status Response Null From Api');
    //     }
    //   } else {
    //     console.log('response form order Id null');
    //   }
    // } catch (error) {
    //   console.log('Accept Order Response Error', error);
    // }
  };

  handleGetDirectionVendor = async () => {
    const item = this.props.navigation.getParam('item', null);
    const {vendorLatitude, vendorLongitude} = item;
    try {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${vendorLatitude},${vendorLongitude}`;
      const label = 'Custom Label';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleGetDirectionCus = async () => {
    const item = this.props.navigation.getParam('item', null);
    const {customerLatitude, customerLongitude} = item;
    try {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${customerLatitude},${customerLongitude}`;
      const label = 'Custom Label';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isLoading} = this.state;
    const item = this.props.navigation.getParam('item', null);
    const {
      orderId,
      customerLatitude,
      customerLongitude,
      vendorLatitude,
      vendorLongitude,
      mapLatitude,
      mapLongitude,
    } = item;

    const LATITUDE = mapLatitude;
    const LONGITUDE = mapLongitude;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const initialRoots = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    if (isLoading) {
      return <CustomLoader />;
    }

    let directionCoords = [
      {latitude: vendorLatitude, longitude: vendorLongitude},
      {latitude: customerLatitude, longitude: customerLongitude},
    ];

    let myDirection = false;

    if (this.coords) {
      myDirection = true;
    }

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent headerTitle="Order Map" nav={this.props.navigation} />

        <MapView
          initialRegion={initialRoots}
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}>
          <MapView.Marker
            coordinate={{
              latitude: vendorLatitude,
              longitude: vendorLongitude,
            }}
            title={'Restaurant is here'}
            pinColor={'red'}
          />

          <MapView.Marker
            coordinate={{
              latitude: customerLatitude,
              longitude: customerLongitude,
            }}
            title={'Your customer is here'}
            pinColor={'#6f42c1'}
          />

          {myDirection ? (
            <MapView.Marker
              coordinate={{
                latitude: this.coords.latitude,
                longitude: this.coords.longitude,
              }}
              title={'You are here'}
              pinColor={'green'}
            />
          ) : null}

          <MapViewDirections
            origin={directionCoords[0]}
            destination={directionCoords[1]}
            optimizeWaypoints={true}
            waypoints={[
              {latitude: vendorLatitude, longitude: vendorLongitude},
              {
                latitude: customerLatitude,
                longitude: customerLongitude,
              },
            ]}
            mode="DRIVING"
            apikey={'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k'}
            language="en"
            strokeWidth={4}
            strokeColor="#ff2626"
          />
        </MapView>

        <TouchableOpacity onPress={this.handleCall} style={styles.Call}>
          <Call name="phone-call" color="#fff" size={24} />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.handleCheck} style={styles.Delivered}>
          <Ionicons
            name="checkmark-done-outline"
            color="#fff"
            size={24}
            // style={styles.iconRow}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.handleGetDirectionVendor}
          style={styles.Direction}>
          <Icon name="restaurant" color="#fff" size={25} />
          <Text style={{fontSize: wp(2.8), fontWeight: '700', color: '#fff'}}>
            GO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.handleGetDirectionCus}
          style={styles.Direction2}>
          <Icon name="directions" color="#fff" size={25} />
          <Text style={{fontSize: wp(2.8), fontWeight: '700', color: '#fff'}}>
            GO
          </Text>
        </TouchableOpacity>

        {this.state.showQualityPopup === true && (
          <UpdatePopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            item={orderId}
            // fetchCartCount={this.fetchCartCount}
            // cartCountUpdate={this.cartCountUpdate}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  Direction: {
    height: hp(6.3),
    width: hp(6.3),
    borderRadius: hp(3.3),
    backgroundColor: '#f57c00',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: wp(3),
    bottom: hp(10.5),
  },
  Direction2: {
    height: hp(6.3),
    width: hp(6.3),
    borderRadius: hp(3.3),
    backgroundColor: '#f57c00',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: wp(3),
    bottom: hp(3),
  },
  Call: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(3),
    backgroundColor: '#f57c00',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: wp(3),
    bottom: hp(18),
  },
  Delivered: {
    height: hp(6),
    width: hp(6),
    borderRadius: hp(3),
    backgroundColor: '#f57c00',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: wp(3),
    bottom: hp(25.5),
  },
  mapIcon: {height: hp(3.5), aspectRatio: 1 / 1},
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusMessage: {
    fontSize: 20,
  },

  listContainer: {
    padding: wp(2),
  },
  separator: {
    height: wp(2),
  },
  offerBackground: {
    width: wp(100),
    height: hp(15),
  },
  couponInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: wp(3),
    height: hp(5.5),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(2),
    color: '#000',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#fff',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(3),
  },
  pinCodeInput: {
    fontSize: wp(3),
    height: hp(5.5),
    color: '#000',
    backgroundColor: '#ffffff80',
    flex: 1,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginRight: wp(3),
  },
  checkButton: {
    backgroundColor: '#00adef',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    textAlign: 'center',
  },
  supportIcon: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  paymentOption: {
    height: hp(4),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  newAddress: {
    backgroundColor: '#00adef',
    paddingVertical: hp(1.5),
    borderRadius: 5,
    width: wp(60),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    height: hp(5.5),
  },
  picAddress: {
    paddingVertical: hp(1),
    borderRadius: 5,
    width: wp(32),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#00adef',
    height: hp(5.5),
  },
  //
  userInfo: {
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    marginTop: wp(2),
    marginLeft: wp(2),
    marginRight: wp(2),
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heading: {
    fontSize: wp(3.5),
    marginBottom: wp(2),
  },

  description: {
    fontSize: wp(3),
  },

  changeAddressButton: {
    borderWidth: 1,
    borderColor: '#db9058',
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(1),
    borderRadius: 3,
    fontSize: wp(3),
  },

  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    color: '#444',
    fontSize: wp(3),
    marginRight: wp(2),
  },

  buttonText: {
    fontSize: wp(3),
    color: '#333',
  },
  checkoutButton: {
    padding: wp(2),
  },
  checkoutButtonView: {
    backgroundColor: '#db9058',
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
});

export default OrderMap;
