import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
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

// Component
import CustomizeAddonsComponent from './CustomizeAddonsComponent';
import RadioComponent from '../PopUpComponents/RadioComponent';
import ProcessingLoader from '../ProcessingLoader';
import {showToast} from '../CustomToast';

//  Styles
import basicStyles from '../../styles/BasicStyles';

// UserPreference
import {KEYS, getData} from '../../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

export default class CartOptionsPopUp extends Component {
  constructor(props) {
    super(props);

    const {quantity} = props.item;

    this.state = {
      isChecked: false,
      customId: '',
      addonId: '',
      selectedRadioButtonIndex: -1,
      selectedCustomization: 'b',
      note: '',
      isCustom: true,
      isAddOns: false,
      productVariants: null,
      price: 0,
      newPrice: 0,
      productAddOns: null,
      isProcessing: false,
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

  componentDidMount() {
    this.getProductDetails();
  }

  getProductDetails = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // const userInfo = await getData(KEYS.USER_INFO);

      // if (userInfo) {
      //   const {id: userId} = userInfo;

      const {productId} = this.props.item;
      const params = {
        productId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/getProductDetail',
        params,
      );

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {quantity} = this.props.item;
          const {itemDetail} = response;
          let {
            productVariants,
            productAddOns,
            isCustom,
            isAddOns,
            price,
          } = itemDetail;

          let nPrice = 0;
          console.log(price);
          if (price) {
            nPrice = price * quantity;
          } else {
            nPrice = 0 * quantity;
          }

          console.log('Price', nPrice);

          this.setState({
            price: nPrice,
            newPrice: nPrice,
            isCustom,
            isAddOns,
            productVariants,
            productAddOns,
            status: null,
            isLoading: false,
          });
        } else {
          const {message} = response;

          this.setState({
            productVariants: null,
            productAddOns: null,
            status: message,
            posts: null,
            isLoading: false,
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

  handleAddToCart = async () => {
    // starting loader
    try {
      const addonDetails = [...this.addonDetails];

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);
      console.log(deviceInfo);
      if (!deviceInfo) {
        return;
      }
      console.log(addonDetails);

      this.setState({isProcessing: true});
      const {deviceId} = deviceInfo;
      const {productId, quantity} = this.props.item;
      const {note, customId} = this.state;

      const params = {
        deviceId,
        productId,
        quantity,
        customId,
        addonId: JSON.stringify(addonDetails),
        note,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/addToCart',
        params,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          this.setState({
            isProcessing: false,
          });

          const {cartCountUpdate} = this.props;

          this.props.closePopup();
          this.props.nav.navigate('Cart');
          let msg = 'happy sinfg';
          await cartCountUpdate(msg);

          showToast(message);
        } else {
          const {deleteCart, message} = response;

          if (deleteCart) {
            // Alert.alert('Alert', message);
            Alert.alert(
              'Alert!',
              message,
              [
                {
                  text: 'Cancel',
                  onPress: this.stopIt,
                },
                {text: 'Remove', onPress: this.removeExistingItem},
              ],
              {
                cancelable: false,
              },
            );

            return;
          } else {
            showToast(message);
          }
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

  stopIt = () => {
    this.setState({
      isProcessing: false,
    });
  };

  removeExistingItem = async () => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/deleteCart',
        params,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({
          isProcessing: false,
        });

        if (success) {
          this.handleAddToCart();
          showToast(message);
        } else {
          showToast(message);
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
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

  handleCheckUnCheck = async () => {
    try {
      await this.setState({isChecked: !this.state.isChecked});
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMessage = (changedText) => {
    this.setState({note: changedText});
  };

  handleGenderChange = (gender) => {
    this.setState({gender});
  };

  handleGenderChange = (gender) => {
    this.setState({gender});
  };

  handleRadioButtonPress = (selectedRadioButtonIndex) => {
    const {productVariants, price} = this.state;
    const {quantity} = this.props.item;
    let custom = productVariants[selectedRadioButtonIndex].name;
    let customId = productVariants[selectedRadioButtonIndex].id;
    let amount = price + productVariants[selectedRadioButtonIndex].price;

    let newPrice = amount * quantity;

    this.setState({
      selectedRadioButtonIndex,
      selectedCustomization: custom,
      newPrice,
      customId,
    });
  };

  renderCustomization = () => {
    const {productVariants, selectedRadioButtonIndex} = this.state;

    return productVariants.map((item, index) => {
      const {id, name, price} = item;
      const obj = {label: name, value: index};

      const radioButton = (
        <RadioButton labelHorizontal={true}>
          <RadioButtonInput
            obj={obj}
            index={index}
            isSelected={index === selectedRadioButtonIndex}
            buttonSize={6}
            borderWidth={2}
            buttonColor={'#f65e83'}
            onPress={this.handleRadioButtonPress}
          />
          <RadioButtonLabel
            obj={obj}
            index={index}
            labelHorizontal={true}
            onPress={this.handleRadioButtonPress}
            labelStyle={styles.radioButtonLabel}
          />
        </RadioButton>
      );

      return (
        <View key={index}>
          <RadioComponent item={item} radioButton={radioButton} />
          {/* <View style={styles.separator} /> */}
        </View>
      );
    });
  };

  handleAddons = (amount, isChecked, addonId) => {
    console.log(amount, isChecked, addonId);
    let {newPrice} = this.state;
    try {
      if (isChecked === true) {
        let updatedPrice = newPrice + amount;
        this.setState({newPrice: updatedPrice, addonId});
      } else if (isChecked === false) {
        let updatedPrice = newPrice - amount;
        this.setState({newPrice: updatedPrice, addonId});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleAddonUpdate = (selected, id) => {
    console.log(selected, id);

    if (selected) {
      this.addonDetails.add(id);
    } else {
      this.addonDetails.delete(id);
    }
  };

  renderItem = ({item}) => (
    <CustomizeAddonsComponent
      item={item}
      nav={this.props.navigation}
      handleAddons={this.handleAddons}
      handleAddonUpdate={this.handleAddonUpdate}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isCustom, isAddOns, price, newPrice} = this.state;
    const {productId, quantity} = this.props.item;

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
            {/* <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.language}
                style={styles.pickerInput}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({language: itemValue})
                }>
                <Picker.Item label="Select Slot" value="selectSlot" />
                <Picker.Item label="10:00 AM to 12:00 PM" value="slotOne" />
                <Picker.Item label="12:00 PM to 06:00 PM" value="slotTow" />
              </Picker>
            </View> */}
            <View
              style={[
                basicStyles.directionRow,
                // basicStyles.justifyBetween,
                basicStyles.alignCenter,
                // basicStyles.paddingBottom,
              ]}>
              <Text style={[basicStyles.heading, basicStyles.lightGreenColor]}>
                Quantity :
              </Text>
              <Text style={[basicStyles.heading, basicStyles.lightGreenColor]}>
                {' '}
                {quantity}
              </Text>
            </View>

            <View style={basicStyles.separatorHorizontal} />
            <View style={[styles.dataContainer]}>
              <Text
                style={[
                  // basicStyles.padding,
                  basicStyles.heading,
                  basicStyles.pinkColor,
                ]}>
                Customize
              </Text>

              {isCustom ? (
                <View style={[basicStyles.flexOne, basicStyles.marginTop]}>
                  {this.state.productVariants ? (
                    <RadioForm animation={true} style={styles.radioForm}>
                      {this.renderCustomization()}
                    </RadioForm>
                  ) : null}
                </View>
              ) : (
                <View>
                  <Text style={[basicStyles.text, basicStyles.margin]}>
                    No Customization Available
                  </Text>
                </View>
              )}
            </View>

            <View style={[styles.dataContainer]}>
              <Text
                style={[
                  // basicStyles.padding,
                  basicStyles.heading,
                  basicStyles.pinkColor,
                  basicStyles.marginTop,
                ]}>
                Add On
              </Text>
              {isAddOns ? (
                <FlatList
                  data={this.state.productAddOns}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  // horizontal={true}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              ) : (
                <View>
                  <Text style={[basicStyles.text, basicStyles.margin]}>
                    No Add On Available
                  </Text>
                </View>
              )}
            </View>

            <View style={basicStyles.separatorHorizontal} />

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignCenter,
                basicStyles.paddingBottom,
              ]}>
              <Text style={basicStyles.heading}>Total Price</Text>
              <Text style={basicStyles.heading}>₹ {newPrice}</Text>
            </View>

            <View style={styles.textareaContainerMain}>
              <Textarea
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                onChangeText={this.handleMessage}
                defaultValue={this.state.note}
                placeholder={'Add Note...'}
                placeholderTextColor={'#444'}
                underlineColorAndroid={'transparent'}
              />
            </View>

            <TouchableOpacity
              onPress={this.handleAddToCart}
              style={[basicStyles.pinkBgColor, styles.addCartButton]}>
              <Text style={[basicStyles.textBold, basicStyles.whiteColor]}>
                Add to Cart
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
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  textarea: {
    padding: wp(2),
  },

  popupContainer: {
    flex: 1,
    marginTop: hp(10),
    backgroundColor: 'white',
    paddingBottom: hp(1),
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
    width: wp(94),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
    marginBottom: hp(3),
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
