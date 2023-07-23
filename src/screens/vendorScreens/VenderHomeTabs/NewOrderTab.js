import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableHighlight,
  Alert,
  RefreshControl,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

//Api's
import {getData, KEYS, clearData} from '../../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';

// Components
import NewOrderTabComponent from '../VendorComponent/NewOrderTabComponent';
import CustomLoader from '../../../components/CustomLoader';
// Styles
import basicStyles from '../BasicStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOrders: null,
      slotData: null,
      status: '',
      slotId: 0,
      isLoading: false,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.fetchNewProducts();
  }

  fetchNewProducts = async (slotId = '') => {
    try {
      this.setState({isLoading: true});

      const params = {
        type: 'newOrder',
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
            // slotData: null,
            newOrders: null,
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
  };

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('VendorLogin');
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

  cartItem = ({item}) => (
    <NewOrderTabComponent
      item={item}
      nav={this.props.navigation}
      fetchNewProducts={this.fetchNewProducts}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  itemSeparator2 = () => <View style={styles.separator2} />;

  handleProfile = () => {
    this.props.navigation.navigate('Vendor Profile');
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={[basicStyles.container]}>
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

        <View style={basicStyles.flexOne}>
          <View style={basicStyles.mainContainer}>
            {this.state.newOrders ? (
              <FlatList
                data={this.state.newOrders}
                renderItem={this.cartItem}
                keyExtractor={this.keyExtractor}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            ) : (
              <View style={styles.noDataStyle}>
                <Text style={styles.noDataTextStyle}>
                  You don't have any Orders yet. Complete your profile to get
                  orders.
                </Text>
                <TouchableOpacity
                  style={styles.buttonProfile}
                  onPress={this.handleProfile}>
                  <Text style={styles.buttonText}>Go to Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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

  buttonProfile: {
    backgroundColor: '#f57c00',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: wp(5),
  },

  buttonText: {
    color: '#fff',
    fontSize: wp(3.5),
    paddingHorizontal: wp(5),
    fontWeight: '700',
  },

  statusMessage: {
    fontSize: 20,
  },

  listContainer: {
    // padding: wp(2),
  },

  slotContainer: {
    paddingHorizontal: wp(2),
  },
  separator: {
    height: 4,
    backgroundColor: '#f5f5f5',
  },
  separator2: {
    width: wp(2),
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
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //height: hp(10),
    backgroundColor: '#fff',
    // borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    paddingHorizontal: wp(15),
    color: '#999',
    fontWeight: '700',
    fontSize: wp(4.2),
    textAlign: 'center',
  },
});
