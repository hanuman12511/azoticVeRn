import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import RadioForm from 'react-native-simple-radio-button';
import SafeAreaView from 'react-native-safe-area-view';
// styles
import basicStyles from '../styles/BasicStyles';

// Images
import logo_white from '../assets/images/logo_white.png';
import logo_black from '../assets/images/logo_black.png';
import login_background from '../assets/images/login_background.png';

// Icons
import ic_GST from '../assets/icons/ic_GST.png';

import {isEmailAddress, isMobileNumber} from '../validations/FormValidator';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//  map Functionality
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');

//Api
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {storeData, KEYS} from '../api/UserPreference';

//component
import {showToast} from '../components/CustomToast';

// Loader
import ProcessingLoader from '../components/ProcessingLoader';

var radio_props = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];

export default class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerVisible: false,
      setDatePickerVisibility: false,
      name: '',
      mobile: '',
      email: '',
      address: '',
      gender: 'male',
      gstNo: '',
      fssaiNo: '',
      description: '',
      lat: '',
      lng: '',
      processingData: false,
    };
  }

  handleGenderChange = (gender) => {
    this.setState({gender});
  };

  handleEmailChange = (email) => {
    this.setState({email});
  };

  handleVendorAddress = async (data, details) => {
    try {
      if (!details) {
        return;
      }
      const {description} = data;
      const {geometry} = details;
      const {location} = geometry;
      const {lat, lng} = location;
      this.setState({
        description,
        lat,
        lng,
      });
      this.setState({address: description});
    } catch (error) {
      console.log(error.message);
    }
  };

  handleNameChange = (name) => {
    this.setState({name});
  };

  handleMobileChange = (mobile) => {
    this.setState({mobile});
  };

  handleGstChange = (gstNo) => {
    this.setState({gstNo});
  };

  handleFoodLicChange = (fssaiNo) => {
    this.setState({fssaiNo});
  };

  handleVendorLogin = () => {
    this.props.navigation.push('VendorLogin');
  };

  handleSignUp = async () => {
    const {
      name,
      mobile,
      email,
      address,
      gender,
      gstNo,
      fssaiNo,
      lat,
      lng,
    } = this.state;

    //Validation
    if (name.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Name', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (!isEmailAddress(email)) {
      Alert.alert('Alert!', 'Please Enter Valid Email', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (!isMobileNumber(mobile)) {
      Alert.alert(
        'Alert!',
        'Please Enter Valid Mobile Number',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }
    if (address.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Address', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (gender.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Gender', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    // if (gstNo.trim() === '') {
    //   Alert.alert('', 'Please enter GST Number', [{ text: 'OK' }], {
    //     cancelable: false,
    //   });
    //   return;
    // }

    if (fssaiNo.trim() === '') {
      Alert.alert('', 'Please enter Food License', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // Starting Loader
      this.setState({processingData: true});

      const params = {
        name,
        mobile,
        email,
        address,
        gender,
        gstNo,
        fssaiNo,
        lat,
        long: lng,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/registration',
        params,
        false,
        false,
      );

      if (response) {
        const {success, message, vendorCode} = response;

        // Stopping Loader
        this.setState({processingData: false});

        if (success) {
          await storeData(KEYS.VENDOR_INFO, {vendorCode});
          const reg = {
            vendorCode,
          };

          // showToast(message);

          this.props.navigation.push('VendorOtp', {reg});

          Alert.alert(
            'Alert',
            message + '. \n' + 'Your Vendor Code is ' + vendorCode,
            [{text: 'OK'}],
            {
              cancelable: false,
            },
          );
        } else {
          Alert.alert('', message, [{text: 'OK'}], {
            cancelable: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <ImageBackground
          source={login_background}
          resizeMode="cover"
          style={[
            basicStyles.flexOne,
            basicStyles.justifyCenter,
            // basicStyles.padding,
          ]}>
          <View style={styles.topSpace} />
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={logo_black}
                resizeMode="cover"
                style={styles.appLogo}
              />
            </View>
            <KeyboardAwareScrollView
              enableOnAndroid
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={[basicStyles.directionRow, styles.inputView]}>
                <Material
                  name="account"
                  color="#333"
                  size={20}
                  style={styles.iconStyle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vendor Name"
                  placeholderTextColor="#999"
                  value={this.state.name}
                  onChangeText={this.handleNameChange}
                />
              </View>

              <View style={[basicStyles.directionRow, styles.inputView]}>
                <Material
                  name="email"
                  color="#333"
                  size={20}
                  style={styles.iconStyle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vendor Email"
                  placeholderTextColor="#999"
                  value={this.state.email}
                  onChangeText={this.handleEmailChange}
                />
              </View>

              <View style={[basicStyles.directionRow, styles.inputView]}>
                <Entypo
                  name="mobile"
                  color="#333"
                  size={20}
                  style={styles.iconStyle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vendor Mobile"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor="#999"
                  value={this.state.mobile}
                  onChangeText={this.handleMobileChange}
                />
              </View>

              <View style={[basicStyles.directionRow, styles.inputView]}>
                <Material
                  name="map-marker"
                  color="#333"
                  size={20}
                  style={styles.iconStyle}
                />

                <ScrollView keyboardShouldPersistTaps="always">
                  <GooglePlacesAutocomplete
                    placeholder="Vendor Address"
                    placeholderTextColor="#999"
                    onPress={(data, details) =>
                      this.handleVendorAddress(data, details)
                    }
                    returnKeyType={'default'}
                    fetchDetails={true}
                    styles={{
                      textInputContainer: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                      },
                      textInput: {
                        textAlignVertical: 'center',
                        marginLeft: wp(-2),
                        marginRight: 0,
                        height: hp(4),
                        color: '#333',
                        fontSize: wp(3),
                        backgroundColor: 'transparent',
                      },
                      predefinedPlacesDescription: {
                        color: '#1faadb',
                      },
                    }}
                    query={{
                      key: 'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k',
                      language: 'en',
                      components: 'country:Ind',
                      fields: 'geometry',
                    }}
                    // currentLocation={true}
                    // currentLocationLabel="Current location"
                    enableHighAccuracyLocation={true}
                    GooglePlacesDetailsQuery={{
                      fields: ['formatted_address', 'geometry'],
                    }}
                  />
                </ScrollView>
              </View>

              <View style={[basicStyles.directionRow, styles.inputView]}>
                <Image
                  source={ic_GST}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vendor GST"
                  //keyboardType="numeric"
                  maxLength={15}
                  placeholderTextColor="#999"
                  value={this.state.gstNo}
                  onChangeText={this.handleGstChange}
                />
              </View>

              <View style={[basicStyles.directionRow, styles.inputView]}>
                <Material
                  name="license"
                  color="#333"
                  size={20}
                  style={styles.iconStyle}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Vendor Food License No."
                  //keyboardType="numeric"
                  maxLength={15}
                  placeholderTextColor="#999"
                  value={this.state.fssaiNo}
                  onChangeText={this.handleFoodLicChange}
                />
              </View>

              <RadioForm
                radio_props={radio_props}
                onPress={this.handleGenderChange}
                formHorizontal={true}
                labelHorizontal={true}
                animation={true}
                buttonSize={12}
                buttonOuterSize={24}
                buttonColor={'#ccc'}
                selectedButtonColor={'#f65e83'}
                labelColor={'#ccc'}
                labelStyle={styles.radioButtonLabel}
                style={styles.radioButton}
              />

              <TouchableOpacity
                onPress={this.handleSignUp}
                style={[
                  basicStyles.pinkBgColor,
                  basicStyles.button,
                  styles.signUpButton,
                ]}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Sign Up
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyCenter,
                  basicStyles.marginTop,
                ]}>
                <Text style={[basicStyles.text]}>Already Register?</Text>
                <TouchableOpacity
                  onPress={this.handleVendorLogin}
                  style={[basicStyles.goldColor]}>
                  <Text style={[basicStyles.heading, basicStyles.pinkColor]}>
                    {'  '}
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </View>
          {this.state.processingData && <ProcessingLoader />}
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  appName: {
    fontSize: wp(5),
    fontWeight: '700',
    marginBottom: hp(5),
    alignSelf: 'center',
  },
  topSpace: {
    height: hp(15),
    alignItems: 'flex-end',
  },

  signupHeading: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(3),
    marginBottom: hp(6),
    textAlign: 'center',
  },

  logoContainer: {
    backgroundColor: 'rgba(242, 241, 241, .8)',
    height: wp(40),
    width: wp(40),
    borderRadius: wp(20),
    alignSelf: 'center',
    marginTop: wp(-22),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    backgroundColor: '#fff',
    padding: wp(4),
  },
  loginHeading: {
    marginBottom: hp(3),
  },

  appLogo: {
    height: wp(20),
    aspectRatio: 2 / 1,
    alignSelf: 'center',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: hp(3),
    paddingHorizontal: wp(2),
    marginBottom: hp(1),
  },
  input: {
    flex: 1,
    fontSize: wp(3),
    height: hp(5),
  },

  signUpButton: {
    borderRadius: hp(3),
    marginTop: hp(2),
    alignSelf: 'center',
  },
  radioButtonLabel: {
    fontSize: wp(3.2),
    color: '#444',
    marginLeft: wp(1),
    marginRight: wp(10),
  },
  radioButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: hp(1.5),
  },
  inputIcon: {
    width: hp(2.5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  iconStyle: {
    marginRight: wp(2),
  },
});
