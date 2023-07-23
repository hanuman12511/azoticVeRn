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
import AntDesign from 'react-native-vector-icons/AntDesign';
import ic_order from '../../assets/icons/ic_order.png';

export default class VendorToCompleteDetailScreen extends Component {
  constructor(props) {
    super(props);

    const item = props.navigation.getParam('item', null);

    this.state = {
      isLoading: false,
      isCancel: false,

      ...item,
    };
  }
  handleCall = async () => {
    try {
      this.setState({isLoading: true});
      const info = this.props.navigation.getParam('item', null);
      const {orderId} = info;

      const params = {orderId};
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/callToCustomer',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;
        this.setState({isLoading: false});
        if (success) {
          showToast(message);
          const {newProduct} = this.props;
          await newProduct();
        } else {
          showToast(message);
        }
      } else {
        this.setState({isLoading: false});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleUpdateStatus = (status) => async () => {
    try {
      this.setState({isLoading: true});

      const {orderId} = this.state;

      const params = {
        orderId,
        status,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/updateOrderStatus',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message, status: orderStatus} = response;
        this.setState({isLoading: false, orderStatus});
        if (success) {
          showToast(message);
          const {getParam, pop} = this.props.navigation;
          const refreshCallback = getParam('refreshCallback', null);

          await refreshCallback();
          if (status === 'dispatched') {
            pop();
          }
        } else {
          showToast(message);
        }
      } else {
        this.setState({isLoading: false});
      }
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error.message);
    }
  };

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
          <Text style={[styles.orderName, basicStyles.textBold]}>
            {productName}
          </Text>
          <Text style={styles.orderQuantity}>{itemPrice}</Text>
        </View>
        {addonDetail ? (
          <View style={[basicStyles.marginTop]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                // basicStyles.marginTopHalf,
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
          <View>
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

        {this.state.images ? (
          <View style={styles.orderTotalContainer}>
            <FlatList
              data={this.state.images}
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
        phoneNumber = `tel:${customerMobile}`;
      } else {
        phoneNumber = `telprompt:${customerMobile}`;
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

  renderDashes = () => {
    return (
      <View>
        <View style={styles.dashLine} />
        <View style={styles.dashLine} />
        <View style={styles.dashLine} />
        <View style={styles.dashLine} />
        <View style={styles.dashLine} />
      </View>
    );
  };
  renderDashesGrey = () => {
    return (
      <View>
        <View style={styles.dashLineGrey} />
        <View style={styles.dashLineGrey} />
        <View style={styles.dashLineGrey} />
        <View style={styles.dashLineGrey} />
        <View style={styles.dashLineGrey} />
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
    let step1;
    let step2;
    let step3;

    if (orderStatus === 'process') {
      step1 = false;
      step2 = 'off';
      step3 = 'off';
    } else if (orderStatus === 'ready') {
      step1 = true;
      step2 = 'active';
      step3 = 'off';
    } else if (orderStatus === 'dispatched') {
      step1 = true;
      step2 = 'done';
      step3 = 'active';
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
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Complete By</Text>
                <Text style={[styles.orderQuantity, {fontSize: wp(3.5)}]}>
                  {completeBy}
                </Text>
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
                <TouchableOpacity
                  style={{zIndex: 10}}
                  onPress={this.handleCallCustomer}>
                  <Text style={styles.orderQuantity}>{customerMobile}</Text>
                </TouchableOpacity>
              </View>

              <View style={basicStyles.separatorHorizontalLight} />

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <Text style={styles.orderName}>Location</Text>
                {/* <Text style={[styles.orderName, {flex: 0}]}>
                  Check{' '}
                </Text> */}
                <TouchableOpacity
                  style={{zIndex: 10}}
                  onPress={this.handleGetDirection}>
                  <Ionicons
                    name="md-location-sharp"
                    color="#000"
                    size={16}
                    style={styles.iconRow}
                  />
                </TouchableOpacity>
              </View>

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
                    basicStyles.flexOne,
                  ]}>
                  <Text style={styles.orderName}>Taxes</Text>

                  <Text style={styles.percentQuantity}>@{taxRate}% </Text>
                  <Text style={styles.orderQuantity2}> Rs. {taxes}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                    basicStyles.flexOne,
                  ]}>
                  <Text style={styles.orderName}>Discount - Vendor</Text>

                  <Text style={styles.percentQuantity}>
                    @{vendorDiscountRate}%{' '}
                  </Text>
                  <Text style={styles.orderQuantity2}>
                    {' '}
                    Rs. {vendorDiscount}
                  </Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                    basicStyles.flexOne,
                  ]}>
                  <Text style={styles.orderName}>Discount - Agzotic</Text>

                  <Text style={styles.percentQuantity}>
                    @{agzoticDiscountRate}%{' '}
                  </Text>
                  <Text style={styles.orderQuantity2}>
                    {' '}
                    Rs. {agzoticDiscount}
                  </Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.justifyBetween,
                    basicStyles.flexOne,
                  ]}>
                  <Text style={styles.orderName}>Commission</Text>

                  <Text style={styles.percentQuantity}>
                    @{commissionRate}%{' '}
                  </Text>
                  <Text style={styles.orderQuantity2}> Rs. {commission}</Text>
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
              {/* <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                  styles.mainTotalContainer,
                ]}>
                <Text style={styles.totalTitle}>Total</Text>
                <Text style={styles.totalAmount}>Rs. {orderTotal}</Text>
              </View> */}
            </View>
          </View>

          {/* Progress Tracker */}

          <View style={styles.track}>
            <View style={[basicStyles.directionRow, basicStyles.alignStart]}>
              <View
                style={[
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  {marginRight: wp(5)},
                ]}>
                <View style={[styles.indicator]}>
                  <Ionicons name="checkmark-circle" size={30} color="#43a047" />
                </View>
                {this.renderDashes()}
              </View>

              <View
                style={[
                  basicStyles.flexOne,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  styles.completed,
                ]}>
                <Text style={basicStyles.headingMedium}>Order In Kitchen</Text>
              </View>
            </View>

            <View style={[basicStyles.directionRow, basicStyles.alignStart]}>
              <View
                style={[
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  {marginRight: wp(5)},
                ]}>
                <View
                  style={
                    step1 === true ? styles.indicator : styles.indicatorOrange
                  }>
                  {step1 === true ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={30}
                      color="#43a047"
                    />
                  ) : (
                    <AntDesign
                      name="exclamationcircleo"
                      size={30}
                      color="#ee7b03"
                    />
                  )}
                </View>
                {step1 === true ? (
                  <View>{this.renderDashes()}</View>
                ) : (
                  <View>{this.renderDashesGrey()}</View>
                )}
              </View>
              {step1 === true ? (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    styles.completed,
                  ]}>
                  <Text style={basicStyles.headingMedium}>
                    Order Ready For Delivery
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                  ]}>
                  <TouchableOpacity
                    style={styles.running}
                    onPress={this.handleUpdateStatus('ready')}>
                    <Text
                      style={[basicStyles.headingMedium, {color: '#ee7b03'}]}>
                      Order Ready For Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={[basicStyles.directionRow, basicStyles.alignStart]}>
              <View
                style={[
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  {marginRight: wp(5)},
                ]}>
                {step2 === 'off' ? (
                  <View style={[styles.indicatorFaded]}>
                    <AntDesign
                      name="exclamationcircleo"
                      size={30}
                      color="#9e9f9f"
                    />
                  </View>
                ) : step2 === 'active' ? (
                  <View style={[styles.indicatorOrange]}>
                    <AntDesign
                      name="exclamationcircleo"
                      size={30}
                      color="#ee7b03"
                    />
                  </View>
                ) : (
                  <View style={[styles.indicator]}>
                    <Ionicons
                      name="checkmark-circle"
                      size={30}
                      color="#43a047"
                    />
                  </View>
                )}
                {step2 === 'off' || step2 === 'active' ? (
                  <View>{this.renderDashesGrey()}</View>
                ) : (
                  <View>{this.renderDashes()}</View>
                )}
              </View>

              {step2 === 'off' ? (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    styles.completed,
                  ]}>
                  <Text style={[basicStyles.headingMedium, {color: '#9e9f9f'}]}>
                    Order Out For Delivery
                  </Text>
                </View>
              ) : step2 === 'active' ? (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                  ]}>
                  <TouchableOpacity
                    style={styles.running}
                    onPress={this.handleUpdateStatus('dispatched')}>
                    <Text
                      style={[basicStyles.headingMedium, {color: '#ee7b03'}]}>
                      Order Out For Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    styles.completed,
                  ]}>
                  <Text style={basicStyles.headingMedium}>
                    Order Out For Delivery
                  </Text>
                </View>
              )}
            </View>

            <View style={[basicStyles.directionRow, basicStyles.alignStart]}>
              <View
                style={[
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  {marginRight: wp(5)},
                ]}>
                {step3 === 'off' ? (
                  <View style={[styles.indicatorFaded]}>
                    <AntDesign
                      name="exclamationcircleo"
                      size={30}
                      color="#9e9f9f"
                    />
                  </View>
                ) : step3 === 'active' ? (
                  <View style={[styles.indicatorOrange]}>
                    <AntDesign
                      name="exclamationcircleo"
                      size={30}
                      color="#ee7b03"
                    />
                  </View>
                ) : (
                  <View style={[styles.indicator]}>
                    <Ionicons
                      name="checkmark-circle"
                      size={30}
                      color="#43a047"
                    />
                  </View>
                )}
              </View>

              {step3 === 'off' ? (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    styles.completed,
                  ]}>
                  <Text style={[basicStyles.headingMedium, {color: '#9e9f9f'}]}>
                    Order Delivered
                  </Text>
                </View>
              ) : step3 === 'active' ? (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    styles.completed,
                  ]}>
                  <Text style={[basicStyles.headingMedium, {color: '#ee7b03'}]}>
                    Order Delivered
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    basicStyles.flexOne,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    styles.completed,
                  ]}>
                  <Text style={[basicStyles.headingMedium]}>
                    Order Delivered
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  track: {
    padding: wp(3),
  },
  indicator: {
    width: wp(12),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
    backgroundColor: '#43a04710',
    borderWidth: 1,
    borderColor: '#43a047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorOrange: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#ee7b0325',
    // borderWidth: 1,
    borderColor: '#ee7b03',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorFaded: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#9993',
    // borderWidth: 1,
    borderColor: '#9998',
    alignItems: 'center',
    justifyContent: 'center',
  },
  running: {
    borderWidth: 2,
    borderColor: '#ee7b03',
    flex: 1,
    height: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(6),
  },
  completed: {
    flex: 1,
    height: wp(12),
    alignItems: 'center',
    borderRadius: wp(6),
  },
  dashLine: {
    height: 5,
    width: 2,
    marginBottom: 4,
    backgroundColor: '#43a04780',
  },
  dashLineGrey: {
    height: 5,
    width: 2,
    marginBottom: 4,
    backgroundColor: '#9997',
  },
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
  orderTotalContainer2: {
    paddingBottom: wp(2),
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 1.5,
    marginBottom: wp(2),
  },
  orderTotalContainer: {
    paddingBottom: wp(3),
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 4,
    marginBottom: wp(3),
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
    fontSize: wp(4),
    color: '#555',
    flex: 1,
  },
  address: {
    fontSize: wp(3.6),
    color: '#333',
    flex: 2.5,
    textAlign: 'right',
  },
  orderQuantity: {
    fontSize: wp(3.8),
    color: '#333',
    fontWeight: '700',
    // flex: 1,
    textAlign: 'right',
  },

  orderQuantity2: {
    fontSize: wp(3.5),
    color: '#333',
    fontWeight: '700',
    textAlign: 'right',
    flex: 0.35,
  },
  percentQuantity: {
    fontSize: wp(3.5),
    color: '#8889',
    // borderWidth: 1,
    textAlign: 'left',
    flex: 0.2,
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
