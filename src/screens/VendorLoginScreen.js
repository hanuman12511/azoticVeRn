import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableHighlight,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import GlobalFont from 'react-native-global-font';
import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// styles
import basicStyles from '../styles/BasicStyles';

import {getData, KEYS, storeData} from '../api/UserPreference';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showToast} from '../components/CustomToast';

// Loader
import ProcessingLoader from '../components/ProcessingLoader';
import {checkPermission} from '../firebase_api/FirebaseAPI';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorCode: '',
      processingData: false,
    };
  }

  handleLogin = async () => {
    try {
      // Starting Loader
      this.setState({processingData: true});

      const {vendorCode} = this.state;

      try {
        const params = {
          vendorCode,
        };
        const response = await makeRequest(
          BASE_URL + 'api/Vendors/login',
          params,
        );
        if (response) {
          const {success, message} = response;

          // Stopping Loader
          this.setState({processingData: false});

          if (success) {
            showToast(message);
            await storeData(KEYS.VENDOR_INFO, {vendorCode});

            this.props.navigation.push('VendorOtp', {vendorCode});
          } else {
            Alert.alert('', message, [{text: 'OK'}], {
              cancelable: false,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleCodeChange = (vendorCode) => {
    this.setState({vendorCode});
  };

  componentDidMount() {
    this.initialSetup();
  }
  initialSetup = async () => {
    try {
      await checkPermission();
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={styles.mainContainer}>
          <KeyboardAwareScrollView
            style={[basicStyles.flexOne, basicStyles.marginTop]}>
            <Text style={styles.signText}>Login</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Vendor Id / Delivery Boy Number"
                placeholderTextColor="#999"
                value={this.state.vendorCode}
                onChangeText={this.handleCodeChange}
                maxLength={10}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <FontAwesome5
                name="check-circle"
                size={20}
                color="#fff"
                style={styles.checkIcon}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
        {this.state.processingData && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(5),
  },
  signText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(4),
    marginBottom: hp(6),
    // fontFamily: 'AbrilFatface-Regular',
  },

  buttonContainer: {
    marginVertical: hp(2),
  },

  checkIcon: {
    position: 'absolute',
    right: hp(2),
    top: hp(1.5),
    fontWeight: '700',
    // backgroundColor: '#fff',
    borderRadius: wp(6),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f1f1',
    borderRadius: 5,
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
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
    color: '#333',
  },

  underlineStyleBase: {
    color: '#333',
    backgroundColor: '#fff',
    width: wp(7),
    marginRight: wp(1),
    height: hp(5),
    borderRadius: wp(3),
    borderWidth: 0,
  },

  otpContainer: {
    marginLeft: wp(8),
    width: wp(65),
    height: hp(6.5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    backgroundColor: '#f57c00',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: wp(3.8),
    fontWeight: '700',
  },

  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(1),
  },

  resetText: {
    color: '#f57c00',
    fontSize: wp(3.5),
    fontWeight: '700',
  },
});
