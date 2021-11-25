import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import CancelOrderTabComponent from '../VendorComponent/CancelOrderTabComponent';

// Styles
import basicStyles from '../BasicStyles';

//API
import {KEYS, getData, clearData} from '../../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import CustomLoader from '../../../components/CustomLoader';

export default class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
      message: '',
      isListRefreshing: false,
    };
  }
  componentDidMount() {
    this.handleCancelOrder();
  }

  handleCancelOrder = async () => {
    try {
      // Starting Loader
      this.setState({isLoading: true});

      // Preparing Params
      const params = {
        status: 'cancelled',
      };

      // Response
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/orderHistory',
        params,
        true,
        false,
      );

      if (response) {
        this.setState({isLoading: false});
        const {success, message, isAuthTokenExpired} = response;
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {newOrders} = response;
          this.setState({orders: newOrders, message, isListRefreshing: false});
        } else {
          this.setState({orders: null, message, isListRefreshing: false});
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
      } else {
        this.setState({isLoading: false});
      }
    } catch (error) {
      console.log(error.message);
    }
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
    this.setState({isLoading: false});

    await clearData();
    this.props.navigation.navigate('VendorLogin');
  };

  cartItem = ({item}) => (
    <CancelOrderTabComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <ScrollView
          contentContainerStyle={basicStyles.flexOne}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          }>
          <View style={basicStyles.mainContainer}>
            {this.state.orders ? (
              <FlatList
                data={this.state.orders}
                renderItem={this.cartItem}
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
                  {this.state.message}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
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
});
