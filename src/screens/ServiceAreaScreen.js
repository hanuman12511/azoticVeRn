import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import SafeAreaView from 'react-native-safe-area-view';
// Styles
import basicStyles from '../styles/BasicStyles';
// Components
import HeaderComponent from '../screens/vendorScreens/VendorComponent/HeaderComponent';
import CustomLoader from '../components/CustomLoader';
import Icon from 'react-native-vector-icons/FontAwesome';

//UserPreference
import {getData, clearData, KEYS} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// Images
import serviceMap from '../assets/images/map.png';
import ic_happy from '../assets/icons/ic_happy.png';

import MapView, {
  MAP_TYPES,
  Polygon,
  ProviderPropType,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {showToast} from '../components/CustomToast';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;

class ServiceAreaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      deliveryCharge: 0,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      vendorLatitude: 0,
      vendorLongitude: 0,
      polygons: [],
      editing: null,
      creatingHole: false,
    };
  }

  componentDidMount() {
    this.checkPermission();
    this.fetchMapPolygons();
  }

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          this.isLocationPermissionBlocked = true;
          Alert.alert(
            'Location Services Not Available',
            'Press OK, then check and enable the Location Services in your Privacy Settings',
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
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
            // this.fetchCurrentPosition();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          // this.fetchCurrentPosition();
          break;
        case RESULTS.BLOCKED:
          this.isLocationPermissionBlocked = true;
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

  fetchMapPolygons = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      let params = null;

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/getVendorServiceArea',
        params,
        true,
        false,
      );

      // Processing Response
      if (response) {
        const {success} = response;
        if (success) {
          const {
            deliveryCharge,
            mapLatitude,
            mapLongitude,
            serviceArea,
            vendorLatitude,
            vendorLongitude,
          } = response;

          const LATITUDE = mapLatitude;
          const LONGITUDE = mapLongitude;
          const LATITUDE_DELTA = 0.0922;
          const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

          this.setState({
            deliveryCharge,
            polygons: serviceArea,
            status: null,
            isLoading: false,
            contentLoading: false,
            vendorLatitude,
            vendorLongitude,
            region: {
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
          });
        } else {
          const {message} = response;

          this.setState({
            polygons: [],
            status: null,
            isLoading: false,
            contentLoading: false,
            region: {
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0,
              longitudeDelta: 0,
            },
          });
        }
        // }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isLoading, deliveryCharge, vendorLatitude, vendorLongitude} =
      this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const mapOptions = {
      scrollEnabled: true,
    };

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Service Area"
          nav={this.props.navigation}
        />

        <View style={{height: '68%'}}>
          <View style={{position: 'relative', height: hp(64)}}>
           <MapView
              provider={PROVIDER_GOOGLE}
              style={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                position: 'absolute',
              }}
              mapType={MAP_TYPES.STANDARD}
              initialRegion={this.state.region}
              {...mapOptions}>
              {this.state.polygons.map(polygon => (
                <Polygon
                  key={polygon.id}
                  coordinates={polygon.coordinates}
                  strokeColor="#F00"
                  fillColor="rgba(255,0,0,0.2)"
                  strokeWidth={2.5}
                />
              ))}
              <MapView.Marker
                coordinate={{
                  latitude: vendorLatitude,
                  longitude: vendorLongitude,
                }}
                title={`You're Here`}
                pinColor={'red'}
              />
            </MapView> 
          </View>
        </View>

        <View style={(basicStyles.container, {marginTop: wp(4)})}>
          <View style={[basicStyles.directionRow, basicStyles.padding]}>
            <Icon name="map-marker" size={30} color="#FF7C48" />
            <View style={[basicStyles.flexOne, basicStyles.marginLeft]}>
              <Text
                style={[
                  basicStyles.headingLarge,
                  basicStyles.marginBottomHalf,
                ]}>
                Details
              </Text>
              <Text style={[basicStyles.text]}>
                140 Pardeanpur, Lal Bangla, Patiala
              </Text>
            </View>
          </View>

          {/* <View style={styles.states}>
            <Image
              source={ic_happy}
              resizeMode="cover"
              style={styles.happyImage}
            />
            <Text style={basicStyles.textLarge}>
              Congratulations! You are in the service zone.
            </Text>
          </View> */}

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.alignCenter,
              basicStyles.margin,
            ]}>
            <Text style={[basicStyles.headingLarge]}>Delivery Charges</Text>
            <Text style={[basicStyles.headingLarge]}>Rs. {deliveryCharge}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

ServiceAreaScreen.propTypes = {
  provider: ProviderPropType,
};

export default ServiceAreaScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // height: '50%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    flexDirection: 'row',
  },
  mapImage: {
    width: wp(100),
    aspectRatio: 1 / 1,
  },
  states: {
    backgroundColor: '#FF7C4810',
    padding: wp(4),
    alignItems: 'center',
  },
  happyImage: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(3),
  },
});
