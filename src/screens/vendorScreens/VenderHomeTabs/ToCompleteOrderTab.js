import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';
import SwitchToggle from 'react-native-switch-toggle';

// Components
import ToCompleteItemsTabComponent from '../VendorComponent/ToCompleteItemsTabComponent';
import ToCompleteOrderWiseComponent from '../VendorComponent/ToCompleteOrderWiseComponent';

// Styles
import basicStyles from '../BasicStyles';

// Icons
import ic_visa from '../assets/icons/ic_visa.png';
import ic_mastercard from '../assets/icons/ic_mastercard.png';
import ic_mastercard_2 from '../assets/icons/ic_mastercard_2.png';
import ic_american_express from '../assets/icons/ic_american_express.png';

// Images
import new_products from '../assets/images/new_products.jpg';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//API
import {KEYS, getData, clearData} from '../../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import CustomLoader from '../../../components/CustomLoader';

export default class ToCompleteOrderTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      newOrders: null,
      orderItems: null,
      message: '',
      isListRefreshing: false,
      isOn: false,
      dataType: 'orders',
      status: '',
      slotId: 0,
      slotData: null,
    };
  }

  componentDidMount() {
    this.fetchNewProducts();
    this.fetchNewItems();
  }

  fetchNewProducts = async (slotId = '') => {
    try {
      this.setState({isLoading: true});

      const params = {
        type: 'toComplete',
        slotId,
      };

      var response = await makeRequest(
        BASE_URL + 'api/Vendors/newOrders',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {newOrders, slotsInfo} = response;
          const newElement = {id: 0, slot: 'All Slots'};

          const slotData = slotsInfo ? [newElement].concat(slotsInfo) : null;

          this.setState({
            slotId: slotId !== '' ? slotId : 0,
            slotData,
            newOrders,
            status: message,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({
            slotId: slotId !== '' ? slotId : 0,
            newOrders: null,
            // slotData: null,
            status: message,
            isLoading: false,
            isListRefreshing: false,
          });
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: false,
              },
            );
            this.handleTokenExpire();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchNewItems = async (slotId = '') => {
    try {
      this.setState({isLoading: true});

      const params = {
        slotId,
      };

      let response = await makeRequest(
        BASE_URL + 'api/Vendors/orderItems',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {orderItems, slotsInfo} = response;
          const newElement = {id: 0, slot: 'All Slots'};

          const slotData = slotsInfo ? [newElement].concat(slotsInfo) : null;

          this.setState({
            slotId: slotId !== '' ? slotId : 0,
            slotData,
            orderItems,
            status: message,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({
            slotId: slotId !== '' ? slotId : 0,
            // slotData: null,
            orderItems: null,
            status: message,
            isLoading: false,
            isListRefreshing: false,
          });
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: false,
              },
            );
            this.handleTokenExpire();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleSlotSort = (id) => async () => {
    await this.fetchNewProducts(id);
    await this.fetchNewItems(id);
  };

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('VendorLogin');
  };

  slotItem = ({item, index}) => {
    let activeStyle = styles.slotTextTile;
    let activeTextStyle = styles.slotText;
    const {slotId} = this.state;

    if (slotId === item.id) {
      activeStyle = {
        ...activeStyle,
        backgroundColor: '#f57c00',
      };
      activeTextStyle = {
        ...activeTextStyle,
        color: '#fff',
      };
    }

    return (
      <TouchableOpacity
        style={activeStyle}
        onPress={this.handleSlotSort(item.id)}>
        <Text style={activeTextStyle}>{item.slot}</Text>
      </TouchableOpacity>
    );
  };

  renderOrderData = ({item}) => (
    <ToCompleteOrderWiseComponent
      item={item}
      nav={this.props.navigation}
      fetchNewProducts={this.fetchNewProducts}
    />
  );

  renderItemData = ({item}) => (
    <ToCompleteItemsTabComponent
      item={item}
      nav={this.props.navigation}
      fetchNewProducts={this.fetchNewProducts}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  itemSeparator2 = () => <View style={styles.separator2} />;

  handleToggleSwitch = async () => {
    let {isOn} = this.state;

    isOn = !isOn;

    if (isOn === true) {
      this.setState({isOn, dataType: 'items'});
      await this.fetchNewItems();
    } else if (isOn === false) {
      this.setState({isOn, dataType: 'orders'});
      await this.fetchNewProducts();
    }
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        {this.state.slotData ? (
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingLeft,
              styles.slots,
            ]}>
            <Text style={styles.slotTitle}>Showing order of:</Text>
            <FlatList
              data={this.state.slotData}
              renderItem={this.slotItem}
              keyExtractor={this.keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator2}
              contentContainerStyle={styles.slotContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
        ) : null}

        <View style={[styles.switchContainer]}>
          <Text style={styles.titleSwitch}>View by</Text>
          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <Text style={[styles.switchTitle, basicStyles.paddingRight]}>
              Orders
            </Text>
            {/* <ToggleSwitch
              isOn={this.state.isOn}
              onColor="#f57c00"
              offColor="#f57c00"
              size="small"
              onToggle={this.handleToggleSwitch}
            /> */}
            {/* <ToggleSwitch
              isOn={this.state.isOn}
              trackOffStyle={styles.switchTrackStyle}
              thumbOffStyle={{...styles.switchButtonStyle, marginLeft: -5}}
              trackOnStyle={styles.switchTrackStyle}
              thumbOnStyle={styles.switchButtonStyle}
              size="small"
              onToggle={this.handleToggleSwitch}
            /> */}

            <SwitchToggle
              switchOn={this.state.isOn}
              onPress={this.handleToggleSwitch}
              circleColorOff="#6D6D6D"
              circleColorOn="#f57c00"
              backgroundColorOn="#C4C4C4"
              backgroundColorOff="#C4C4C4"
              containerStyle={styles.switchButton}
              circleStyle={styles.switchCircle}
            />

            <Text style={[styles.switchTitle, basicStyles.paddingLeft]}>
              Items
            </Text>
          </View>
        </View>

        <View style={basicStyles.flexOne}>
          {this.state.dataType === 'orders' ? (
            <View style={basicStyles.mainContainer}>
              {this.state.newOrders ? (
                <FlatList
                  data={this.state.newOrders}
                  renderItem={this.renderOrderData}
                  keyExtractor={this.keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              ) : (
                <View style={basicStyles.noDataStyle}>
                  <Text style={basicStyles.noDataTextStyle}>
                    {this.state.status}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={basicStyles.mainContainer}>
              {this.state.orderItems ? (
                <FlatList
                  data={this.state.orderItems}
                  renderItem={this.renderItemData}
                  keyExtractor={this.keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              ) : (
                <View style={basicStyles.noDataStyle}>
                  <Text style={basicStyles.noDataTextStyle}>
                    {this.state.status}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  statusStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slots: {
    borderBottomColor: '#f5f5f5',
    // borderWidth: 1,
    borderBottomWidth: 2,
    paddingVertical: wp(2.5),
  },
  slotTextTile: {
    backgroundColor: '#F5F5F5',
    height: hp(4.5),
    padding: wp(2),
    borderRadius: 5,
    alignItems: 'center',
  },
  slotContainer: {
    paddingHorizontal: wp(2),
  },
  separator2: {
    width: wp(2),
  },
  slotText: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#999',
  },

  slotTitle: {
    fontSize: wp(3.2),
    fontWeight: '400',
    color: '#999',
  },

  statusMessage: {
    fontSize: 20,
  },
  listContainer: {
    padding: wp(2),
  },
  separator: {
    height: 4,
    backgroundColor: '#f5f5f5',
  },
  offerBackground: {
    width: wp(100),
    height: hp(15),
  },
  couponInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: wp(3),
    height: hp(5.5),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(2),
    color: '#000',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#fff',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(3),
  },
  pinCodeInput: {
    fontSize: wp(3),
    height: hp(5.5),
    color: '#000',
    backgroundColor: '#ffffff80',
    flex: 1,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginRight: wp(3),
  },
  checkButton: {
    backgroundColor: '#00adef',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    textAlign: 'center',
  },
  supportIcon: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  paymentOption: {
    height: hp(4),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  newAddress: {
    backgroundColor: '#00adef',
    paddingVertical: hp(1.5),
    borderRadius: 5,
    width: wp(60),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    height: hp(5.5),
  },
  picAddress: {
    paddingVertical: hp(1),
    borderRadius: 5,
    width: wp(32),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#00adef',
    height: hp(5.5),
  },
  //
  userInfo: {
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    marginTop: wp(2),
    marginLeft: wp(2),
    marginRight: wp(2),
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heading: {
    fontSize: wp(3.5),
    marginBottom: wp(2),
  },

  description: {
    fontSize: wp(3),
  },

  changeAddressButton: {
    borderWidth: 1,
    borderColor: '#db9058',
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(1),
    borderRadius: 3,
    fontSize: wp(3),
  },

  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    color: '#444',
    fontSize: wp(3),
    marginRight: wp(2),
  },

  buttonText: {
    fontSize: wp(3),
    color: '#333',
  },
  checkoutButton: {
    padding: wp(2),
  },
  checkoutButtonView: {
    backgroundColor: '#db9058',
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    paddingVertical: wp(2),
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 2,
  },
  titleSwitch: {
    fontSize: wp(3.2),
    color: '#555',
  },
  switchTitle: {
    fontSize: wp(3.2),
    color: '#555',
  },
  switchButtonStyle: {
    height: 20,
    width: 20,
    borderRadius: 40,
    backgroundColor: '#ee7b03',
  },
  switchTrackStyle: {
    width: 35,
    height: 15,
    paddingRight: 3,
    backgroundColor: '#dadfe3',
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
