import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Linking,
  Alert,
  TouchableHighlightBase,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import SwitchToggle from 'react-native-switch-toggle';

import LinearGradient from 'react-native-linear-gradient';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_food from '../assets/icons/ic_food.png';

// VectorIcons
import Feather from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialIcons';
import {showToast} from '../../../components/CustomToast';
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {KEYS, getData} from '../../../api/UserPreference';

// Style
import basicStyles from '../../../styles/BasicStyles';

export default class LiveTabComponent extends Component {
  constructor(props) {
    super(props);
    const {productStatus} = props.item;
    this.state = {
      addFavStatus: true,
      status: '',
      value: '',
      switchValue: '',
      switchCheck: productStatus,
      colorTrueSwitchIsOn: true,
      colorFalseSwitchIsOn: false,
      isEnabled: productStatus,
    };
  }

  // toggleSwitch = value => {
  //   this.setState({ switchValue: value, status: value });
  //   console.log(typeof 'this.state.addFaveStatus', this.state.status, 'the value are ', this.state.switchValue);
  // };
  toggleSwitchs = async () => {
    this.setState({switchCheck: !this.state.switchCheck});
    try {
      const {productId} = this.props.item;
      if (productId) {
        const params = {
          productId,
          productStatus: !this.state.switchCheck,
        };
        const response = await makeRequest(
          BASE_URL + 'api/Vendors/updateItemStatus',
          params,
          true,
          false,
        );
        console.log('product Status', response);
        if (response) {
          const {success, message} = response;
          if (success) {
            showToast(message);
          } else {
            showToast(message);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMenuDetail = () => {
    const {productId} = this.props.item;
    this.props.nav.navigate('VendorMenuDetail', {productId});
  };

  handleEditItem = () => {
    const {showMenuList, item} = this.props;

    this.props.nav.navigate('EditMenuItems', {
      item,
      showMenuList: showMenuList,
    });
  };

  render() {
    const {
      productId,
      productName,
      productStatus,
      productImage,
      custom,
      productVariants,
      productPrice,
    } = this.props.item;

    const orderContainer = {
      // marginVertical: hp(1.5),
      backgroundColor: '#fff',
      paddingBottom: wp(2),
      // borderBottomRightRadius: wp(5),
      // borderTopLeftRadius: wp(5),
    };

    // const [isEnabled, setIsEnabled] = useState(false);

    return (
      <View style={orderContainer}>
        <View style={[basicStyles.directionRow]}>
          <Image
            source={{uri: productImage}}
            resizeMode="cover"
            style={styles.imageStyle}
          />

          <View style={styles.contentContainer}>
            <View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.alignCenter,
                ]}>
                <Text
                  style={[
                    basicStyles.text,
                    basicStyles.marginRight,
                    basicStyles.flexOne,
                    basicStyles.grayColor,
                  ]}>
                  ID: #{productId}
                </Text>

                <Text style={{fontSize: wp(3.5), color: '#999'}}>
                  {this.state.switchCheck ? 'In Stock' : 'Out of Stock'}
                </Text>

                <SwitchToggle
                  switchOn={this.state.switchCheck}
                  onPress={this.toggleSwitchs}
                  circleColorOff="#6D6D6D"
                  circleColorOn="#f57c00"
                  backgroundColorOn="#C4C4C4"
                  backgroundColorOff="#C4C4C4"
                  containerStyle={styles.switchButton}
                  circleStyle={styles.switchCircle}
                />
              </View>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.alignCenter,
                ]}>
                {/* <Image
                source={ic_food}
                resizeMode="cover"
                style={styles.foodIcon}
              /> */}
                <Text
                  style={[
                    basicStyles.grayColor,
                    basicStyles.headingLarge,
                    basicStyles.marginRight,
                    basicStyles.flexOne,
                  ]}>
                  {productName}
                </Text>
              </View>
            </View>

            <View
              style={[basicStyles.justifyBetween, basicStyles.directionRow]}>
              {/* <TouchableOpacity
                style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <Text style={[basicStyles.text, basicStyles.orangeColor]}>
                  Edit Slot
                </Text>
                <Material
                  size={18}
                  name={'calendar-today'}
                  color="#f57c00"
                  style={styles.addIcon}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={this.handleEditItem}
                style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <Text style={[basicStyles.text, basicStyles.orangeColor]}>
                  Edit
                </Text>
                <Feather
                  size={18}
                  name={'edit'}
                  color="#f57c00"
                  style={styles.addIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            basicStyles.paddingHorizontal,
            basicStyles.paddingBottom,
          ]}>
          <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
            <Text style={[styles.textStyle, basicStyles.pinkColor]}>
              Price:
            </Text>
            <Text
              style={[
                styles.textStyle,
                basicStyles.text,
                basicStyles.pinkColor,
              ]}>
              ₹ {productPrice}
            </Text>
          </View>
          <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
            <Text style={[styles.textStyle, basicStyles.pinkColor]}>
              Ratings:
            </Text>
            <Text
              style={[
                styles.textStyle,
                basicStyles.text,
                basicStyles.pinkColor,
              ]}>
              4.5
            </Text>
          </View>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  barPart: {
    marginLeft: wp(2),
  },

  contentContainer: {
    flex: 1,
    paddingLeft: wp(3),
    justifyContent: 'space-between',
    paddingVertical: wp(2),
  },

  chefName: {
    marginTop: hp(3),
    // marginBottom: wp(1.5),
  },

  barContainer: {
    height: hp(1),
    width: wp(38),
    marginVertical: hp(0.5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp(1),
  },
  barStyle: {
    height: hp(0.8),
    width: wp(26),
    backgroundColor: '#853a77',
    borderRadius: hp(1),
  },
  imageStyle: {
    width: hp(13),
    aspectRatio: 1 / 1,
    // margin: wp(1.5),
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: '#f65e83',
    // marginTop: hp(-5),
  },
  pmTextStyle: {
    textAlign: 'right',
    fontSize: wp(3),
  },
  textStyle: {
    fontSize: wp(3.2),
  },

  listBottom: {
    // marginTop: hp(1),
  },
  addButton: {
    backgroundColor: '#f65e83',
    width: hp(5),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(3),
    borderTopLeftRadius: wp(3),
  },

  favButtonContainer: {
    // position: 'absolute',
    // right: -5,
    // top: -5,
  },
  foodIcon: {
    width: hp(2.8),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  addValue: {
    borderWidth: 0.5,
    borderColor: '#333',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  quantity: {
    borderWidth: 0.5,
    borderColor: '#333',
    height: 20,
    width: 40,
    lineHeight: 20,
    textAlign: 'center',
  },
  lessValue: {
    borderWidth: 0.5,
    borderColor: '#333',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  addIcon: {
    marginLeft: wp(1),
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
