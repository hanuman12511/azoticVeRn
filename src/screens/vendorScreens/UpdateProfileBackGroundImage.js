import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProcessingLoader from '../../components/ProcessingLoader';

//images
import camera from '../vendorScreens/assets/icons/ic_photo_camera.png';
import upload_cover from '../../assets/images/upload_cover.jpeg';
import upload_profile from '../../assets/images/upload_profile.jpeg';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//image picker and permission
import ImagePicker from 'react-native-image-picker';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import {showToast} from '../../components/CustomToast';
//  Styles
import basicStyles from '../../styles/BasicStyles';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

var radio_props = [
  {label: 'Profile Image', value: 'profile'},
  {label: 'BackGround Image', value: 'background'},
];

export default class UpdateProfileBackGroundImage extends Component {
  constructor(props) {
    super(props);

    const {
      vendorName = '',
      vendorAddress = '',
      gstNumber = '',
      fssaiNumber = '',
      bio = '',
    } = this.props.items;

    this.state = {
      isProcessing: false,
      userMedia: null,
      userImage: null,
      backgroundMedia: null,
      backgroundImage: null,
      name: vendorName,
      address: vendorAddress,
      bio: bio,
      fssaiNo: fssaiNumber,
      gstNo: gstNumber,
    };
    this.parentView = null;
    this.addonDetails = new Set();
  }

  componentDidMount() {
    this.handlePermission();
    // this.checkLocationPermission();
  }

  checkLocationPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          // this.isLocationPermissionBlocked = true;
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
              this.fetchCurrentPosition();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.fetchCurrentPosition();
          break;
        case RESULTS.BLOCKED:
          // this.isLocationPermissionBlocked = true;
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
    this.setState({isProcessing: true});
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
      this.setState({isProcessing: true});

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

          const filteredName = results[0].address_components;
          const locationName = filteredName[1].long_name;

          this.setState({
            address: currentLocationAddress,
            locationName,
            isProcessing: false,
          });
        } else {
          const {error_message} = response;
          console.log(error_message);

          this.setState({
            formatted_address: '',
            isProcessing: false,
          });
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      this.setState({isProcessing: false});
      console.log(error.message);
    }
  };

  geolocationErrorCallback = (error) => {
    this.setState({isProcessing: false});
    if (
      error.code === 2 &&
      error.message === 'No location provider available.'
    ) {
      Alert.alert(
        'Location Alert!',
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

  handleStartShouldSetResponder = (event) => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  setViewRef = (ref) => {
    this.parentView = ref;
  };

  handleUpdateProfile = async () => {
    // starting loader
    const {
      userMedia,
      backgroundMedia,
      name,
      address,
      fssaiNo,
      gstNo,
      bio,
    } = this.state;
    const {closePopup} = this.props;
    try {
      this.setState({isProcessing: true});

      const params = {
        name,
        address,
        gstNo,
        fssaiNo,
        image: userMedia,
        backgroundImage: backgroundMedia,
        bio,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/updateVendorProfile',
        params,
        true,
        false,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;
        console.log(response);
        if (success) {
          await closePopup();

          this.setState({
            isProcessing: false,
            isLoading: false,
          });

          await this.props.fetchVendorProfile();

          showToast(message);
        } else {
          const {message} = response;

          this.setState({
            isProcessing: false,
            isLoading: false,
          });

          showToast(message);

          return;
        }
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

  handlePermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
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
            // this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          // this.handleImagePick();
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

  handleImagePick = (type) => async () => {
    try {
      ImagePicker.showImagePicker(
        {
          noData: true,
          mediaType: 'photo',
          quality: 0.7,
          maxWidth: 750,
          maxHeight: 500,
        },
        (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            if (Platform.OS === 'android') {
              // Preparing Image Data
              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: response.fileName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              if (type === 'profile') {
                this.setState({
                  userMedia: imageData,
                  userImage: response.uri,
                });
              } else if (type === 'background') {
                this.setState({
                  backgroundMedia: imageData,
                  backgroundImage: response.uri,
                });
              }
            } else if (Platform.OS === 'ios') {
              let imgName = response.name;

              if (typeof fileName === 'undefined') {
                const {uri} = response;
                var getFilename = uri.split('/');
                imgName = getFilename[getFilename.length - 1];
              }

              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: imgName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              if (type === 'profile') {
                this.setState({
                  userMedia: imageData,
                  userImage: response.uri,
                });
              } else if (type === 'background') {
                this.setState({
                  backgroundMedia: imageData,
                  backgroundImage: response.uri,
                });
              }
            }
          }
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  stopIt = () => {
    this.setState({
      isProcessing: false,
    });
  };

  render() {
    const {userImage, backgroundImage} = this.state;

    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <ScrollView
            style={[
              basicStyles.padding,
              basicStyles.flexOne,
              // styles.popupContainer,
            ]}>
            <View
              style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
              {userImage ? (
                <TouchableOpacity
                  onPress={this.handleImagePick('profile')}
                  style={basicStyles.alignCenter}>
                  <Image source={{uri: userImage}} style={styles.imageStyles} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.handleImagePick('profile')}
                  style={basicStyles.alignCenter}>
                  <Image source={upload_profile} style={styles.imageStyles} />
                </TouchableOpacity>
              )}

              {backgroundImage ? (
                <TouchableOpacity
                  onPress={this.handleImagePick('background')}
                  style={basicStyles.alignCenter}>
                  <Image
                    source={{uri: backgroundImage}}
                    style={styles.imageStyles}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.handleImagePick('background')}
                  style={basicStyles.alignCenter}>
                  <Image source={upload_cover} style={styles.imageStyles} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#999"
                value={this.state.name}
                onChangeText={(e) => {
                  this.setState({name: e});
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textarea}
                placeholder="Enter Bio Here..."
                placeholderTextColor="#888"
                value={this.state.bio}
                multiline={true}
                onChangeText={(e) => {
                  this.setState({bio: e});
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="#999"
                value={this.state.address}
                onChangeText={(e) => {
                  this.setState({address: e});
                }}
              />
              <TouchableOpacity onPress={this.checkLocationPermission}>
                <Material
                  name="my-location"
                  color="#f57c00"
                  size={20}
                  style={styles.vectorIconRow}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="FSSAI Number"
                placeholderTextColor="#999"
                value={this.state.fssaiNo}
                onChangeText={(e) => {
                  this.setState({fssaiNo: e});
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="GST Number"
                placeholderTextColor="#999"
                value={this.state.gstNo}
                onChangeText={(e) => {
                  this.setState({gstNo: e});
                }}
              />
            </View>

            <TouchableOpacity
              onPress={this.handleUpdateProfile}
              style={[
                basicStyles.button,
                styles.addCartButton,
                basicStyles.mediaTop,
                basicStyles.orangeBgColor,
              ]}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {this.state.isProcessing && <ProcessingLoader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
    // alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
  },
  textarea: {
    flex: 1,
    paddingTop: wp(1.5),
    padding: wp(1),
    height: hp(10),
    textAlignVertical: 'top',
    borderRadius: 5,
    marginRight: wp(2),
  },
  popupContainer: {
    flex: 1,
    marginTop: hp(28),
    backgroundColor: 'white',
    paddingBottom: hp(1),
    borderTopRightRadius: hp(3),
    borderTopLeftRadius: hp(3),
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: hp(3),
    marginBottom: hp(1),
  },

  pickerInput: {
    flex: 1,
    // height: hp(8),
  },

  checkBoxStyle: {
    color: '#fff',
    height: hp(1),
  },

  addCartButton: {
    alignSelf: 'center',
    height: hp(6),
    width: wp(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
    marginBottom: hp(3),
    marginTop: hp(3),
  },
  textareaContainerMain: {
    marginVertical: hp(2),
    height: hp(10),
    alignSelf: 'center',
    width: wp(94),
    borderWidth: 0.5,
    borderColor: '#555',
    borderRadius: wp(2),
  },
  radioButtonLabel: {
    fontSize: wp(3.2),
    color: '#444',
    marginLeft: wp(1),
    marginRight: wp(10),
  },
  radioButton: {
    justifyContent: 'flex-start',
    marginTop: hp(1.5),
  },
  cameraIconStyle: {
    alignSelf: 'center',
    height: hp(6.7),
    width: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(10),
    marginBottom: hp(3),
    marginTop: hp(3),
    backgroundColor: '#f57c00',
  },
  iconStyle: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
  },
  imageStyles: {
    height: wp(30.5),
    aspectRatio: 1.5 / 1,
    borderRadius: wp(3),
    backgroundColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: wp(3),
    marginTop: wp(3),
  },

  inputIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  input: {
    flex: 1,
    fontSize: wp(3.8),
    height: hp(6),
    color: '#444',
  },
});
