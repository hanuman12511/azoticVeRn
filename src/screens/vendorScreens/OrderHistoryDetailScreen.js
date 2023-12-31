import React, {Component} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Linking,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Styles
import basicStyles from '../../styles/BasicStyles';

//api
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// Components
import HeaderComponent from '../../screens/vendorScreens/VendorComponent/HeaderComponent';
import ProcessLoader from '../../components/ProcessLoader';
import CancleOrder from '../../components/CancleOrder';
import {showToast} from '../../components/CustomToast';
// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ic_order from '../../assets/icons/ic_order.png';
import new_products from '../../assets/images/new_products.jpg';

export default class OrderHistoryDetailScreen extends Component {
  constructor(props) {
    super(props);

    const item = props.navigation.getParam('item', null);

    this.state = {
      isLoading: false,
      isCancel: false,

      ...item,
      // images: [
      //   {
      //     image:
      //       'http://dc6twl7ai2u9d.cloudfront.net/cartImages/6164198112615.jpg',
      //   },
      // ],
    };
  }

  orderItem = ({item}) => {
    let {
      productName,
      itemPrice,
      addonDetail,
      customs,
      customNotes,
      images,
    } = item;

    if (!images) {
      images = this.state.images;
    }
    return (
      <View>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={styles.orderName}>{productName}</Text>
          <Text style={styles.orderQuantity}>{itemPrice}</Text>
        </View>
        {addonDetail ? (
          <View style={[basicStyles.marginTop]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                // basicStyles.marginTop,
              ]}>
              <View style={styles.idContainer}>
                <View style={styles.smallIconCover}>
                  <Image
                    source={ic_order}
                    resizeMode="cover"
                    style={styles.smallIdIcon}
                  />
                </View>
                <Text style={[styles.idTextSmall]}>Add ons</Text>
              </View>
            </View>

            <View style={styles.orderTotalContainer2}>
              <FlatList
                data={addonDetail}
                renderItem={this.addOnItem}
                keyExtractor={this.keyExtractor}
                // ItemSeparatorComponent={this.AddCusSeparator}
                // contentContainerStyle={styles.listContainer}
              />
            </View>
          </View>
        ) : null}

        {customs ? (
          <View style={[basicStyles.marginTopHalf]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                basicStyles.paddingHalfBottom,
              ]}>
              <View style={styles.idContainer}>
                <View style={styles.smallIconCover}>
                  <Image
                    source={ic_order}
                    resizeMode="cover"
                    style={styles.smallIdIcon}
                  />
                </View>
                <Text style={[styles.idTextSmall]}>Customs</Text>
              </View>
            </View>

            <View style={styles.orderTotalContainer2}>
              <FlatList
                data={customs}
                renderItem={this.customItem}
                keyExtractor={this.keyExtractor}
                // ItemSeparatorComponent={this.orderSeparator}
              />
            </View>
          </View>
        ) : null}

        {customNotes ? (
          <View style={[basicStyles.marginTopHalf]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                basicStyles.paddingBottom,
              ]}>
              <View style={styles.idContainer}>
                <View style={styles.smallIconCover}>
                  <Image
                    source={ic_order}
                    resizeMode="cover"
                    style={styles.smallIdIcon}
                  />
                </View>
                <Text style={[styles.idTextSmall]}>Special Notes</Text>
              </View>
            </View>

            <View style={styles.spacialNotesContainer}>
              <Text style={styles.spacialNotesText}>"{customNotes}"</Text>
            </View>
          </View>
        ) : null}

        {images ? (
          <View style={styles.orderTotalContainer}>
            <FlatList
              data={images}
              horizontal
              renderItem={this.imageItem}
              showsHorizontalScrollIndicator={false}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.imageSeparator}
              contentContainerStyle={styles.imageFlatContainer}
            />
          </View>
        ) : null}
      </View>
    );
  };

  addOnItem = ({item}) => {
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.justifyBetween,
          basicStyles.marginTopHalf,
        ]}>
        <Text style={styles.orderNameSmall}>{item.name}</Text>
        <Text style={styles.orderQuantitySmall}>Rs. {item.price}</Text>
      </View>
    );
  };

  customItem = ({item}) => {
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.justifyBetween,
        ]}>
        <Text style={styles.orderNameSmall}>{item.name}</Text>
        <Text style={styles.orderQuantitySmall}>Rs. {item.price}</Text>
      </View>
    );
  };

  handleGetDirection = async () => {
    const {customerLocation, customerAddress} = this.state;
    const {lat: latitude, long: longitude} = customerLocation;
    try {
      const label = customerAddress;

      const url = Platform.select({
        ios: 'maps:' + latitude + ',' + longitude + '?q=' + label,
        android: 'geo:' + latitude + ',' + longitude + '?q=' + label,
      });

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleCallCustomer = async () => {
    const {customerMobile} = this.state;
    try {
      let phoneNumber = '';
      if (Platform.OS === 'android') {
        phoneNumber = `tel:${'+91' + customerMobile}`;
      } else {
        phoneNumber = `telprompt:${'+91' + customerMobile}`;
      }

      const supported = await Linking.canOpenURL(phoneNumber);

      if (supported) {
        Linking.openURL(phoneNumber);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  imageItem = ({item}) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.image}}
          resizeMode="cover"
          style={styles.imageTile}
        />
      </View>
    );
  };

  keyExtractor = (item, index) => index.toString();

  orderSeparator = () => <View style={styles.orderSeparator} />;
  AddCusSeparator = () => <View style={styles.addCusSeparator} />;
  imageSeparator = () => <View style={styles.imageSeparator} />;

  render() {
    const {
      orderId,
      orderDate,
      completeBy,
      customerName,
      customerMobile,
      orderTotal,
      customerAddress,
      customerLocation,
      orderStatus,
      productImage,
      slotsList,
      images,
      orderItems,
      titleType,
      deliveryCharges,
      taxRate,
      taxes,
      vendorDiscountRate,
      vendorDiscount,
      agzoticDiscountRate,
      agzoticDiscount,
      commissionRate,
      commission,
    } = this.state;

    const {isLoading, isCancel} = this.state;
    if (isLoading) {
      return <ProcessLoader />;
    }
    if (isCancel) {
      return <CancleOrder />;
    }
    return (
      <SafeAreaView style={basicStyles.container}>
        <HeaderComponent
          headerTitle="Order Detail"
          navAction="back"
          nav={this.props.navigation}
        />

        <ScrollView
          style={[
            basicStyles.container,
            basicStyles.whiteBackgroundColor,
            styles.pageWrapper,
          ]}>
          <View style={[basicStyles.mainContainer, basicStyles.padding]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                basicStyles.paddingBottom,
              ]}>
              <View style={styles.idContainer}>
                <View style={styles.iconCover}>
                  <Image
                    source={ic_order}
                    resizeMode="cover"
                    style={styles.idIcon}
                  />
                </View>
                <Text style={[styles.idText]}>Order Detail</Text>
              </View>

              <Text style={[styles.idText]}>Order ID: {orderId}</Text>
            </View>

            <View style={styles.orderTotalContainer}>
              <FlatList
                data={orderItems}
                renderItem={this.orderItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.orderSeparator}
                // contentContainerStyle={styles.listContainer}
              />

              <View style={basicStyles.separatorHorizontalLight} />
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Total</Text>
                <Text style={styles.orderQuantity}>Rs. {orderTotal}</Text>
              </View>
              <View style={basicStyles.separatorHorizontalLight} />
              {/* <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Status</Text>
                <Text style={styles.orderQuantity}>{orderStatus}</Text>
              </View> */}
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>{titleType} On</Text>
                <Text style={styles.orderQuantity}>{completeBy}</Text>
              </View>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                basicStyles.paddingBottom,
              ]}>
              <View style={styles.idContainer}>
                <View style={styles.iconCover}>
                  <Image
                    source={ic_order}
                    resizeMode="cover"
                    style={styles.idIcon}
                  />
                </View>
                <Text style={[styles.idText]}>Order Details</Text>
              </View>
            </View>
            <View style={styles.orderTotalContainer}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Name</Text>
                <Text style={styles.orderQuantity}>{customerName}</Text>
              </View>
              <View style={basicStyles.separatorHorizontalLight} />
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Contact</Text>
                <Text style={styles.orderQuantity}>{customerMobile}</Text>
              </View>

              <View style={basicStyles.separatorHorizontalLight} />

              <TouchableOpacity
                onPress={this.handleGetDirection}
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Location</Text>
                {/* <Text style={[styles.orderName, {flex: 0}]}>
                  Check{' '}
                </Text> */}
                <Ionicons
                  name="md-location-sharp"
                  color="#000"
                  size={16}
                  style={styles.iconRow}
                />
              </TouchableOpacity>

              <View style={basicStyles.separatorHorizontalLight} />
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Address</Text>
                <Text style={styles.address}>{customerAddress}</Text>
              </View>

              <View style={basicStyles.separatorHorizontalLight} />
              <View>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={styles.orderName}>Delivery Charges</Text>
                  <Text style={styles.orderQuantity}>
                    Rs. {deliveryCharges}
                  </Text>
                </View>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={styles.orderName}>Taxes</Text>
                  <View style={[basicStyles.directionRow, {flex: 0.6}]}>
                    <Text style={styles.percentQuantity}>
                      @{taxRate ? taxRate : '  0'}%{' '}
                    </Text>
                    <Text style={styles.orderQuantity}> Rs. {taxes}</Text>
                  </View>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={styles.orderName}>Discount - Vendor</Text>
                  <View style={[basicStyles.directionRow, {flex: 0.6}]}>
                    <Text style={styles.percentQuantity}>
                      @{vendorDiscountRate ? vendorDiscountRate : '  0'}%{' '}
                    </Text>
                    <Text style={styles.orderQuantity}>
                      {' '}
                      Rs. {vendorDiscount}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={styles.orderName}>Discount - Agzotic</Text>

                  <View style={[basicStyles.directionRow, {flex: 0.6}]}>
                    <Text style={styles.percentQuantity}>
                      @{agzoticDiscountRate ? agzoticDiscountRate : '  0'}%{' '}
                    </Text>
                    <Text style={styles.orderQuantity}>
                      {' '}
                      Rs. {agzoticDiscount}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={styles.orderName}>Commission</Text>

                  <View style={[basicStyles.directionRow, {flex: 0.6}]}>
                    <Text style={styles.percentQuantity}>
                      @{commissionRate ? commissionRate : '  0'}%{' '}
                    </Text>
                    <Text style={styles.orderQuantity}> Rs. {commission}</Text>
                  </View>
                </View>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                    styles.mainTotalContainer,
                  ]}>
                  <Text style={styles.totalTitle}>Total</Text>
                  <Text style={styles.totalAmount}>Rs. {orderTotal}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    padding: wp(2),
  },

  detailInfoContainer: {
    // borderWidth: 1,
    height: wp(20),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // alignItems:''
  },
  orderTotalContainer: {
    paddingBottom: wp(3),
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 4,
    marginBottom: wp(3),
  },
  orderTotalContainer2: {
    paddingBottom: wp(2),
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 1.5,
    marginBottom: wp(2),
  },
  iconRow: {
    width: wp(6),
    textAlign: 'center',
  },
  checkButton: {
    height: hp(6),
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: wp(1),
    marginBottom: wp(3),
  },
  deleteButton: {
    height: hp(6),
    flex: 1,
    backgroundColor: '#F57C00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: wp(1),
    marginBottom: wp(3),
  },
  callButton: {
    height: hp(6),
    flex: 1,
    backgroundColor: '#643969',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: wp(1),
    marginBottom: wp(3),
  },

  detailImage: {
    width: wp(23),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: 3,
  },

  productInfo: {
    backgroundColor: '#fff',
    // marginTop: hp(2),
    padding: wp(2),
    elevation: 5,
    borderRadius: 5,
  },
  infoIcon: {
    backgroundColor: '#ccc',
    height: wp(7),
    width: wp(7),
    borderRadius: wp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    textAlign: 'center',
    lineHeight: wp(7),
  },
  listContainer: {
    padding: wp(2),
  },
  separator: {
    height: wp(3),
  },

  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCover: {
    backgroundColor: '#F57C0020',
    height: wp(8),
    width: wp(8),
    borderRadius: 4,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIconCover: {
    backgroundColor: '#F57C0020',
    height: wp(5),
    width: wp(5),
    borderRadius: 4,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIdIcon: {
    height: wp(3.2),
    aspectRatio: 1 / 1,
  },
  idIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  idTextSmall: {
    fontSize: wp(3.2),
    color: '#999',
  },
  idText: {
    fontSize: wp(3.5),
    color: '#999',
  },
  pageWrapper: {
    borderTopWidth: 4,
    borderTopColor: '#f5f5f5',
  },
  orderNameSmall: {
    fontSize: wp(3.5),
    color: '#555',
    flex: 1,
  },
  orderName: {
    fontSize: wp(3.9),
    color: '#555',
    flex: 1.5,
  },
  address: {
    fontSize: wp(3.6),
    color: '#333',
    flex: 2.5,
    textAlign: 'right',
  },
  // orderQuantity: {
  //   fontSize: wp(3.8),
  //   color: '#333',
  //   fontWeight: '700',
  //   flex: 1,
  //   textAlign: 'right',
  // },
  orderQuantity: {
    fontSize: wp(3.5),
    color: '#333',
    fontWeight: '700',
    // flex: 1,
    textAlign: 'left',
  },
  percentQuantity: {
    fontSize: wp(3.5),
    color: '#8889',
    // fontWeight: '700',
    // textAlign: 'right',
    // flex: 1,
  },
  orderQuantitySmall: {
    fontSize: wp(3.3),
    color: '#333',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  addCusSeparator: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: wp(0.7),
  },
  orderSeparator: {
    height: 2.5,
    backgroundColor: '#9993',
    marginVertical: wp(4),
  },
  imageSeparator: {
    width: wp(2),
  },
  spacialNotesContainer: {
    backgroundColor: '#F57C0010',
    minHeight: hp(5),
    borderRadius: 5,
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F57C0080',
  },
  spacialNotesText: {
    fontSize: wp(3.8),
    fontWeight: '700',
  },
  imageFlatContainer: {
    paddingTop: wp(4),
    paddingVertical: wp(2),
  },
  imageContainer: {
    width: wp(22),
  },
  imageTile: {
    height: wp(22),
    aspectRatio: 1 / 1,
    borderRadius: 10,
  },
  mainTotalContainer: {
    borderTopWidth: 4,
    borderTopColor: '#f5f5f5',
    paddingTop: wp(4),
    marginTop: wp(3),
  },
  totalTitle: {
    fontSize: wp(4.2),
    color: '#555',
    fontWeight: '700',
  },
  totalAmount: {
    color: '#F57C00',
    fontSize: wp(4.2),
    fontWeight: '700',
  },
  acceptText: {
    fontSize: wp(4),
    color: '#fff',
  },
});
