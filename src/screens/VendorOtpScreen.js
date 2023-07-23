import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import CountDown from 'react-native-countdown-component';
// styles
import basicStyles from '../styles/BasicStyles';

//api
import {KEYS, getData, storeData} from '../api/UserPreference';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
//component
import {showToast} from '../components/CustomToast';

// Loader
import ProcessingLoader from '../components/ProcessingLoader';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      isProcessing: false,
      otpActive: false,
      isEnabled: false,
      isHide: true,
      count: 40,
    };
  }

  handleLogin = async () => {
    const {otp} = this.state;
    const vendorCode = this.props.navigation.getParam('vendorCode', null);
    const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

    const {deviceId} = deviceInfo;

    try {
      // Starting Loader
      this.setState({isProcessing: true});

      // Preparing Params
      const params = {
        vendorCode,
        deviceId,
        otp,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/loginOtpVerify',
        params,
        false,
        false,
      );

      // Processing Response
      if (response) {
        const {success, message, userInfo} = response;

        // Stopping Loader
        this.setState({isProcessing: false});

        if (success) {
          await storeData(KEYS.USER_INFO, userInfo);

          showToast(message);
          if (userInfo) {
            const {role} = userInfo;
            let info = userInfo;
            if (role) {
              if (role === 'vendor') {
                this.props.navigation.navigate('VendorLoggedIn', {info});
              } else if (role === 'driver') {
                this.props.navigation.navigate('DriverLogin');
              }
            }
          }
        } else {
          showToast(message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleResendOtp = async () => {
    // Fetching Data
    const vendorCode = this.props.navigation.getParam('vendorCode', null);

    try {
      // starting loader
      this.setState({isProcessing: true});

      // Preparing Params
      const params = {
        vendorCode,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/resendOtp',
        params,
        false,
        false,
      );

      // processing response
      if (response) {
        // stopping loader

        this.setState({
          isProcessing: false,
        });
        const {success, message} = response;

        if (success) {
          // Storing UserInfo

          this.setState({
            isProcessing: false,
            isHide: true,
            isEnabled: false,
            count: 40,
          });

          showToast(message);
        } else {
          Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
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
      console.log(error.message);
    }
  };

  handleEnable = () => {
    this.setState({
      isHide: false,
      isEnabled: true,
    });
  };

  // handleSignUp = () => {
  //   this.props.navigation.push('Register');
  // };
  handleOTPActives = (otp) => {
    if (otp.length === 4) {
      this.setState({otpActive: true});
    } else {
      this.setState({otpActive: false});
    }
  };

  render() {
    const {otpActive, isEnabled, count, isHide} = this.state;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={styles.mainContainer}>
          <KeyboardAwareScrollView
            style={[basicStyles.flexOne, basicStyles.marginTop]}>
            <Text style={styles.signText}>Enter OTP</Text>

            <View style={styles.inputContainer}>
              <OTPInputView
                style={styles.otpContainer}
                pinCount={4}
                autoFocusOnLoad
                placeholderCharacter="-"
                placeholderTextColor="#999"
                codeInputFieldStyle={styles.underlineStyleBase}
                onCodeChanged={this.handleOTPActives}
                onCodeFilled={(otp) => {
                  this.setState({otp});
                }}
              />
            </View>

            {otpActive ? (
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleLogin}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.button, {backgroundColor: '#bbbbbb'}]}>
                <Text style={styles.buttonText}>Continue</Text>
              </View>
            )}

            <Text style={styles.receivedMessage}>Enter the received OTP.</Text>

            <View style={styles.otpButton}>
              {isEnabled ? (
                <TouchableOpacity onPress={this.handleResendOtp}>
                  <Text style={styles.otpResend}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <View onPress={this.handleResendOtp}>
                  <Text style={[styles.otpResend, {color: '#666'}]}>
                    Resend OTP In
                  </Text>
                </View>
              )}
              {isHide ? (
                <View style={{marginLeft: wp(0.5)}}>
                  <CountDown
                    until={count}
                    size={10}
                    onFinish={this.handleEnable}
                    digitStyle={{backgroundColor: '#fff'}}
                    digitTxtStyle={{
                      color: '#f57c00',
                      fontSize: wp(4),
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                    }}
                    timeToShow={['M', 'S']}
                    timeLabels={{m: '', s: ''}}
                    showSeparator
                    separatorStyle={{color: '#f57c00'}}
                  />
                </View>
              ) : null}
            </View>

            {/* <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetText}>Resent OTP</Text>
            </TouchableOpacity> */}
          </KeyboardAwareScrollView>
        </View>
        {this.state.isProcessing && <ProcessingLoader />}
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
  topSpace: {
    height: hp(30),
  },
  buttonContainer: {
    marginVertical: hp(2),
  },

  checkIcon: {
    position: 'absolute',
    right: hp(2),
    top: hp(1.5),
    fontWeight: '700',
  },

  button: {
    backgroundColor: '#f57c00',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: wp(2),
  },

  receivedMessage: {
    fontSize: wp(3.8),
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: wp(3),
    color: '#999',
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
  },
  appLogo: {
    height: wp(20),
    aspectRatio: 2 / 1,
    alignSelf: 'center',
  },
  topMargin: {
    marginTop: hp(4),
  },

  signText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(4),
    marginBottom: hp(6),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#f2f1f1',
    borderRadius: hp(3),
    paddingHorizontal: wp(2),
    marginBottom: hp(2),
  },
  inputIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: wp(3.2),
    height: hp(6),
  },

  underlineStyleBase: {
    color: '#333',
    backgroundColor: '#9993',
    width: wp(15),
    height: wp(15),
    marginHorizontal: wp(1),
    borderRadius: 5,
    borderWidth: 0,
    fontSize: wp(5),
    fontWeight: '700',
  },
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   borderRadius: 4,
  //   paddingHorizontal: wp(2),
  //   marginVertical: hp(2),
  // },
  otpContainer: {
    marginLeft: wp(8),
    width: wp(65),
    height: hp(6.5),
    alignItems: 'center',
    justifyContent: 'center',
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
  otpResend: {
    color: '#f57c00',
    textAlign: 'center',
    fontWeight: '700',
    marginVertical: wp(2),
    fontSize: wp(3.5),
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#f57c00',
  },
  otpButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
