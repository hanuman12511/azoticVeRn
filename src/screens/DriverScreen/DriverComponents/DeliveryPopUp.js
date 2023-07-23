import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import Textarea from 'react-native-textarea';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {Picker} from '@react-native-picker/picker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//images

//image
import user from '../../vendorScreens/assets/icons/ic_profile_black.png';
import mobileImg from '../../vendorScreens/assets/icons/ic_phone_black.png';
import commentImg from '../../vendorScreens/assets/icons/ic_order_history.png';
import {showToast} from '../../../components/CustomToast';
import CustomLoader from '../../../components/DriverFoodDelivery';
//  Styles
import basicStyles from '../../../styles/BasicStyles';

// UserPreference
import {KEYS, getData} from '../../../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';

var radio_props = [
  {label: 'Self', value: 'self'},
  {label: 'Other', value: 'other'},
];

export default class DeliveryPopUp extends Component {
  constructor(props) {
    super(props);

    const item = this.props.item;
    console.log(item);
    this.state = {
      isChecked: false,
      selectedRadioButtonIndex: -1,
      selectedCustomization: 'b',
      productVariants: null,
      productAddOns: null,
      isLoading: false,
      name: '',
      mobile: '',
      comment: '',
      type: 'self',
      orderId: item,
    };
    this.parentView = null;
    this.addonDetails = new Set();
  }

  handleStartShouldSetResponder = (event) => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  setViewRef = (ref) => {
    this.parentView = ref;
  };

  stopIt = () => {
    this.setState({
      isProcessing: false,
    });
  };

  valueChange = (type) => {
    console.log(type);
    this.setState({type});
  };

  onNameChange = (name) => {
    this.setState({name});
  };
  onMobileChange = (mobile) => {
    this.setState({mobile});
  };
  onCommentChange = (comment) => {
    this.setState({comment});
  };
  handleSubmit = async () => {
    try {
      const {name, mobile, orderId, comment, type} = this.state;
      const {closePopup} = this.props;
      //Validation
      if (type.trim() === '') {
        Alert.alert(
          'Alert!',
          'Please Select Who Accept The Order',
          [{text: 'OK'}],
          {
            cancelable: false,
          },
        );
        return;
      }
      if (name.trim() === '') {
        Alert.alert('Alert!', 'Please Enter Name', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }
      if (mobile.length === 0) {
        Alert.alert('Alert!', 'Please Enter Mobile No.', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      this.setState({isLoading: true});

      const params = {
        deliveredToName: name,
        mobile,
        orderId,
        comment,
        type,
      };
      const response = await makeRequest(
        BASE_URL + 'api/DeliveryBoys/deliveryConfirmation',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;

        if (success) {
          this.setState({isLoading: false});
          await closePopup();
          this.props.nav.popToTop();
          showToast(message);
        } else {
          const {message} = response;
          this.setState({isLoading: false});
          Alert.alert(
            'Alert!',
            message,
            [
              {
                text: 'Cancel',
                onPress: this.stopIt,
              },
            ],
            {
              cancelable: false,
            },
          );

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
  render() {
    const {isLoading, name, mobile, comment} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
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
            <RadioForm
              radio_props={radio_props}
              onPress={this.valueChange}
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
            <View style={styles.profileRow}>
              <Image source={user} resizeMode="cover" style={styles.infoIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                value={name}
                onChangeText={this.onNameChange}
              />
            </View>
            <View style={styles.profileRow}>
              <Image
                source={mobileImg}
                resizeMode="cover"
                style={styles.infoIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Mobile"
                keyboardType="numeric"
                maxLength={10}
                value={mobile}
                onChangeText={this.onMobileChange}
              />
            </View>
            <View style={styles.profileRow}>
              <Image
                source={commentImg}
                resizeMode="cover"
                style={styles.infoIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Comment"
                value={comment}
                onChangeText={this.onCommentChange}
              />
            </View>
            <TouchableOpacity
              onPress={this.handleSubmit}
              style={[
                basicStyles.button,
                styles.addCartButton,
                basicStyles.mediaTop,
                basicStyles.pinkBgColor,
              ]}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* {this.state.isProcessing && <ProcessingLoader />} */}
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
    padding: wp(2),
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f1f1',
    height: hp(7),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },
  textInput: {
    fontSize: wp(3.2),
  },
  infoIcon: {
    width: wp(4.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  popupContainer: {
    flex: 1,
    marginTop: hp(30),
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
});
