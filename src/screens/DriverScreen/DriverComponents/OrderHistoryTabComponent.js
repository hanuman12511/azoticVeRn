import React, {Component} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../../../styles/BasicStyles';

// // Images
// import image1 from '../assets/images/image1.jpeg';

// // Icons
// import ic_delete_black from '../assets/icons/ic_delete_black.png';
// import ic_down from '../assets/icons/ic_down.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//api
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {showToast} from '../../../components/CustomToast';
import CustomLoader from '../../../components/DriverMap';
import CancleOrder from '../../../components/DriverFoodDelivery';

export default class NewOrderTabComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isCancel: false,
      common: false,
    };
  }

  handleMoreInfo = (moreInfo) => () => {
    this.setState((prevState) => ({[moreInfo]: !prevState[moreInfo]}));
  };

  handleCall = async () => {
    try {
      this.setState({isCancel: true});
      const {orderId} = this.props.item;
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
          this.setState({isCancel: false});
          if (success) {
            console.log('order Success');
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

  renderAddonDetail = ({item}) => {
    console.log(item);
    return (
      <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
        <Text style={styles.moreContent}>{item.item} </Text>
        <Text style={[styles.moreContent, basicStyles.textBold]}>
          x {item.quantity}
        </Text>
      </View>
    );
  };
  itemSeparator = () => <View style={basicStyles.separatorHorizontal} />;

  render() {
    const {moreInfo, isLoading, isCancel} = this.state;
    const {
      orderId,
      vendorName,
      name,
      deliveryAddress,
      customerLatitude,
      customerLongitude,
      vendorLatitude,
      vendorLongitude,
      placedDate,
      deliveryDate,
      finalAmount,
      totalItems,
      paymentType,
      image,
      items,
    } = this.props.item;

    if (isLoading) {
      return <CustomLoader />;
    }
    if (isCancel) {
      return <CancleOrder />;
    }
    return (
      <View style={[styles.orderListContainer, basicStyles.padding]}>
        <View>
          <View style={[basicStyles.directionRow]}>
            <Image
              source={{uri: image}}
              resizeMode="cover"
              style={styles.cartImage}
            />

            <View style={[basicStyles.flexOne, basicStyles.justifyCenter]}>
              <View>
                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.marginHorizontal,
                  ]}>
                  <Text
                    style={[
                      basicStyles.textSmall,
                      basicStyles.textBold,
                      basicStyles.paddingHalfRight,
                    ]}>
                    Order ID :
                  </Text>
                  <Text style={[basicStyles.textSmall]}># {orderId}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.marginHorizontal,
                  ]}>
                  <Text
                    style={[
                      basicStyles.textSmall,
                      basicStyles.textBold,
                      basicStyles.paddingHalfRight,
                    ]}>
                    Vendor Name :
                  </Text>
                  <Text style={[basicStyles.textSmall]}>{vendorName}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.marginHorizontal,
                  ]}>
                  <Text
                    style={[
                      basicStyles.textSmall,
                      basicStyles.textBold,
                      basicStyles.paddingHalfRight,
                    ]}>
                    Order Total :
                  </Text>
                  <Text style={[basicStyles.textSmall]}>₹ {finalAmount}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.marginHorizontal,
                  ]}>
                  <Text
                    style={[
                      basicStyles.textSmall,
                      basicStyles.textBold,
                      basicStyles.paddingHalfRight,
                    ]}>
                    Order Date :
                  </Text>
                  <Text style={[basicStyles.textSmall]}> {placedDate}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.marginHorizontal,
                  ]}>
                  <Text
                    style={[
                      basicStyles.textSmall,
                      basicStyles.textBold,
                      basicStyles.paddingHalfRight,
                    ]}>
                    Delivery Date :
                  </Text>
                  <Text style={[basicStyles.textSmall]}> {deliveryDate}</Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.marginTop,
              basicStyles.justifyBetween,
              basicStyles.alignCenter,
            ]}>
            <View
              style={[
                basicStyles.directionRow,
                // basicStyles.flexOne,
                basicStyles.alignCenter,
              ]}>
              <Material
                name="account"
                color="#000"
                size={18}
                style={styles.iconRow}
              />
              <Text style={[basicStyles.text]}>Mr. {name}</Text>
            </View>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.marginHorizontal,
                // {marginLeft: wp(6)},
              ]}>
              <Text style={[basicStyles.text, basicStyles.paddingHalfRight]}>
                Payment Mode :
              </Text>
              <Text
                style={[
                  basicStyles.text,
                  basicStyles.textBold,
                  basicStyles.textCapitalize,
                ]}>
                {paymentType}
              </Text>
            </View>

            <TouchableOpacity
              onPress={this.handleMoreInfo('moreInfo')}
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginLeft,
              ]}>
              <Text
                style={[
                  basicStyles.text,
                  basicStyles.textBold,
                  {color: '#f57c00'},
                ]}>
                More
              </Text>
              <Entypo
                name="chevron-down"
                color="#f57c00"
                size={18}
                // style={styles.iconRow}
              />
            </TouchableOpacity>
          </View>
        </View>

        {moreInfo && (
          <View style={[styles.moreInfoContainer]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginBottom,
              ]}>
              <Material
                name="map-marker"
                color="#000"
                size={18}
                style={styles.iconRow}
              />
              <Text style={basicStyles.text}>{deliveryAddress}</Text>
            </View>

            <View style={[basicStyles.justifyBetween]}>
              <Text style={styles.moreContentTitle}>Ordered Items</Text>
              <FlatList
                data={items}
                renderItem={this.renderAddonDetail}
                keyExtractor={(item) => item.id}
                //numColumns={2}
                //ItemSeparatorComponent={this.itemSeparator}
              />
              {/* <Text style={styles.moreContent}>X{''}</Text> */}
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  orderListContainer: {
    marginVertical: hp(0.5),
    backgroundColor: '#fff',
    // borderBottomRightRadius: wp(5),
    // borderTopLeftRadius: wp(5),
    borderRadius: wp(2),
    marginTop: hp(1),
    elevation: 5,
  },
  cartImage: {
    width: wp(25),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: wp(12.5),
    // marginTop: hp(-2.5),
    borderWidth: 2,
    borderColor: '#f57c00',
  },
  buttonsContainer: {
    marginTop: hp(-3),
  },
  checkButton: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#f57c00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(2),
    marginHorizontal: wp(1),
  },
  callButton: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#f57c00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(2),
    marginHorizontal: wp(1),
  },
  deleteButton: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#f57c00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(2),
    marginHorizontal: wp(1),
  },

  downIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(3),
  },
  moreInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: wp(2),
    paddingTop: wp(2),
    // flexDirection: 'row',
  },
  moreInfoList: {
    padding: hp(1),
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc80',
  },
  moreInfoText: {
    fontSize: wp(2.8),
  },
  addValue: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  quantity: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 40,
    lineHeight: 20,
    textAlign: 'center',
  },
  lessValue: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  iconRow: {
    marginRight: wp(1),
  },
  moreContentTitle: {
    fontSize: wp(3),
    fontWeight: '700',
    marginBottom: wp(0.5),
  },
  moreContent: {
    fontSize: wp(2.8),
  },
  // itemSeparator: {
  //   height: 1,
  //   backgroundColor: '#ccc',
  //   marginVertical: wp(1),
  // },
});
